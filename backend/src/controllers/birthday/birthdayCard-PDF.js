const PDFDocument = require('pdfkit');

/**
 * Creates a birthday card PDF for a student.
 * @param {string} studentName The name of the student.
 * @returns {Promise<Buffer>} A promise that resolves with the PDF buffer.
 */
const createBirthdayCard = (studentName) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: 'A5',
                layout: 'landscape',
                margin: 0
            });

            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                resolve(Buffer.concat(buffers));
            });

            // --- Card Design ---
            // Background Gradient
            const grad = doc.linearGradient(0, 0, doc.page.width, doc.page.height);
            grad.stop(0, '#fce38a').stop(1, '#f38181');
            doc.rect(0, 0, doc.page.width, doc.page.height).fill(grad);

            // Title
            doc.fontSize(48).fillColor('#ffffff').font('Helvetica-Bold').text('Happy Birthday!', {
                align: 'center',
                y: 100
            });

            // Student's Name
            doc.fontSize(36).fillColor('#ffffff').font('Helvetica').text(studentName, {
                align: 'center',
                y: 200
            });
            
            // Message
            doc.fontSize(18).fillColor('#ffffff').font('Helvetica-Oblique').text(
                'Wishing you a day filled with joy and a year full of success. From all of us at Greenwood International School.', 
                {
                    align: 'center',
                    y: 300,
                    width: doc.page.width - 100,
                    x: 50
                }
            );

            doc.end();

        } catch (err) {
            reject(err);
        }
    });
};

module.exports = { createBirthdayCard };
