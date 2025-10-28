const cron = require('node-cron');
const pool = require('../../connections/DB.connect.js'); // Adjust path
const { createBirthdayCard } = require('./birthdayCard-PDF.js'); // Adjust path
const { sendEmailWithAttachment } = require('./emailSendingService.js'); // Adjust path

/**
 * Finds students whose birthday is today and sends them a birthday card via email.
 */
const sendBirthdayWishes = async () => {
    console.log('🎂 Running daily birthday check...');
    let client;
    try {
        client = await pool.connect();
        // This query finds students where the month and day of their birth match today's month and day.
        const { rows: students } = await client.query(`
            SELECT student_name, parent_email
            FROM students
            WHERE 
                EXTRACT(MONTH FROM date_of_birth) = EXTRACT(MONTH FROM CURRENT_DATE) AND
                EXTRACT(DAY FROM date_of_birth) = EXTRACT(DAY FROM CURRENT_DATE) AND
                status = 'Active';
        `);

        if (students.length === 0) {
            console.log('No birthdays today.');
            return;
        }

        console.log(`Found ${students.length} birthday(s) today.`);

        for (const student of students) {
            if (!student.parent_email) {
                console.log(`Skipping ${student.student_name} - no parent email found.`);
                continue;
            }

            // 1. Generate the PDF card
            const pdfBuffer = await createBirthdayCard(student.student_name);
            
            // 2. Send the email
            await sendEmailWithAttachment(
                student.parent_email,
                `Happy Birthday, ${student.student_name}!`,
                student.student_name,
                pdfBuffer
            );
        }

    } catch (err) {
        console.error('Error during birthday check:', err);
    } finally {
        if (client) client.release();
    }
};

/**
 * Initializes the cron job to run at 9:00 AM every day.
 */
const initializeBirthdayScheduler = () => {
    // '0 9 * * *' is the cron syntax for "at 09:00 every day".
    cron.schedule('00 9 * * *', sendBirthdayWishes, {
        timezone: "Asia/Kolkata" // Set to your school's timezone
    });

    console.log('🎉 Birthday scheduler initialized. Will run every day at 9:00 AM.');
};

module.exports = { initializeBirthdayScheduler };
