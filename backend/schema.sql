CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- This updated schema allows for NULL values in non-essential fields, perfect for bulk uploading.
CREATE TABLE faculty (
    id SERIAL PRIMARY KEY,
    
    -- Required Fields
    f_name VARCHAR(255) NOT NULL,
    l_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    aadhar_number VARCHAR(12) UNIQUE NOT NULL,
    role TEXT NOT NULL,
    
    -- Optional Fields
    password TEXT, -- Will be NULL until the faculty sets it
    address TEXT,
    phone_number VARCHAR(15),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Recommended trigger to automatically update the `updated_at` timestamp.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_faculty_updated_at
BEFORE UPDATE ON faculty
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- Table for storing subjects
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    subject_name VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for storing classes
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    standard VARCHAR(50) NOT NULL, -- e.g., '10', '12sci', 'lkg'
    division VARCHAR(10) NOT NULL, -- e.g., 'A', 'B'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Ensure that the combination of standard and division is unique
    UNIQUE (standard, division)
);

-- This table defines the master schedule template for the school.
CREATE TYPE school_day AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');

CREATE TABLE periods (
    id SERIAL PRIMARY KEY,
    day school_day NOT NULL,
    period_number INTEGER NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- A school cannot have two 'Period 1's on the same day.
    UNIQUE (day, period_number)
);

-- This table is the central mapping point for the daily schedule.
CREATE TABLE timetable (
    id SERIAL PRIMARY KEY,
    period_id INTEGER NOT NULL REFERENCES periods(id) ON DELETE CASCADE,
    class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    faculty_id INTEGER NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    
    -- Timestamps REQUIRED for the upsert logic to work
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- This constraint is essential for the ON CONFLICT clause to work.
    UNIQUE (period_id, class_id)
);

-- A helper function and trigger to automatically update the `updated_at` timestamp on any change.
-- This is a standard and highly recommended practice in PostgreSQL.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_timetable_updated_at
BEFORE UPDATE ON timetable
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- This updated schema allows for NULL values in non-essential fields, perfect for bulk uploading.
CREATE TABLE students (
    -- Core Student Information (still required)
    id SERIAL PRIMARY KEY,
    admission_number VARCHAR(50) UNIQUE NOT NULL,
    student_name VARCHAR(100) NOT NULL,
    
    -- Academic Information (class is required)
    class_id INTEGER NOT NULL REFERENCES classes(id),
    
    -- Optional Information (can be NULL)
    date_of_birth DATE,
    place_of_birth VARCHAR(255),
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
    blood_group VARCHAR(5) CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    nationality VARCHAR(50) DEFAULT 'Indian',
    religion VARCHAR(50),
    admission_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Graduated', 'Withdrawn')),
    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    parent_primary_phone VARCHAR(15),
    parent_secondary_phone VARCHAR(15),
    parent_email VARCHAR(255),
    address_line1 TEXT,
    address_line2 TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    student_photo_url TEXT,
    father_photo_url TEXT,
    mother_photo_url TEXT,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Recommended trigger to automatically update the `updated_at` timestamp.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_student_updated_at
BEFORE UPDATE ON students
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- This table will store one record per student per day.
CREATE TABLE daily_attendance (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    
    -- Status can be extended with 'Late', 'Half-day', etc. in the future.
    status VARCHAR(10) NOT NULL CHECK (status IN ('Present', 'Absent', 'Late')),
    
    -- Optional: A field for remarks (e.g., "Sick leave application received").
    remarks TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- IMPORTANT: Prevent duplicate entries for the same student on the same day.
    UNIQUE (student_id, attendance_date)
);

-- Optional but recommended: Create an index for faster lookups by date and class.
CREATE INDEX idx_attendance_date_class_id ON daily_attendance(attendance_date, class_id);

-- This table stores details for school events like annual days, sports days, etc.
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    
    -- New: Foreign key to link the event to a specific class.
    -- This can be NULL for school-wide events.
    class_id INTEGER REFERENCES classes(id) ON DELETE SET NULL,
    
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    
    location TEXT,
    description TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Recommended trigger to automatically update the `updated_at` timestamp on changes.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- This single table stores the entire exam timetable for the school.
CREATE TABLE exam_schedule (
    id SERIAL PRIMARY KEY,
    
    -- The name of the exam event, e.g., 'Mid-Term Exam 2025', 'Unit Test 1'
    exam_name VARCHAR(255) NOT NULL,
    
    -- Foreign keys to link with other tables
    class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    
    -- Scheduling Information
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    
    -- Marks Information
    total_marks INTEGER NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP

    -- A class cannot have the same subject scheduled twice for the same exam event.
    -- This is the key constraint for data integrity.
);

-- This table stores the marks obtained by each student in a specific scheduled exam.
CREATE TABLE exam_marks (
    id SERIAL PRIMARY KEY,
    
    -- Foreign key to the specific exam paper (e.g., Class 10-A, Math, Mid-Term Exam)
    exam_schedule_id INTEGER NOT NULL REFERENCES exam_schedule(id) ON DELETE CASCADE,
    
    -- Foreign key to the student
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    
    -- The marks obtained by the student
    marks_obtained INTEGER NOT NULL,
    
    -- Optional fields for more detail
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- CRITICAL: A student can only have one entry of marks for a specific exam schedule.
    UNIQUE (exam_schedule_id, student_id)
);

-- Trigger to automatically update the `updated_at` timestamp on changes.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_exam_marks_updated_at
BEFORE UPDATE ON exam_marks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- This table stores details for school meetings like parent-teacher meetings, staff meetings, etc.
CREATE TABLE meetings (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    
    -- Storing date and time separately as per the schema structure
    meeting_date DATE NOT NULL,
    meeting_time TIME NOT NULL, -- Using TIME as it's more appropriate than TIMESTAMP here
    
    location TEXT,
    description TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- This table stores the inventory of all books in the school library.
CREATE TABLE library_books (
    id SERIAL PRIMARY KEY,
    
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    
    -- ISBN is a unique identifier for a book edition. Stored as TEXT/VARCHAR because it can contain hyphens.
    isbn VARCHAR(20) UNIQUE NOT NULL,
    
    category VARCHAR(100),
    
    -- `total_quantity` is the total number of copies the school owns.
    quantity INTEGER NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP

);

-- Trigger to automatically update the `updated_at` timestamp on changes.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_library_books_updated_at
BEFORE UPDATE ON library_books
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- This table tracks each time a book is issued to and returned by a student.
CREATE TABLE book_transactions (
    id SERIAL PRIMARY KEY,
    
    -- Foreign key to the book being issued
    book_id INTEGER NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
    
    -- Foreign key to the student borrowing the book
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    
    -- Dates for the transaction
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL, -- The date the book is expected to be returned
    actual_return_date DATE, -- This will be NULL until the book is returned
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- This table stores the master list of all non-book inventory items like lab equipment, sports gear, etc.
CREATE TABLE school_inventory (
    id SERIAL PRIMARY KEY,
    
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    
    -- `total_quantity` is the total number of this item the school owns.
    total_quantity INTEGER NOT NULL CHECK (total_quantity >= 0),
    
    -- `available_quantity` is how many are currently in storage and available to be issued.
    available_quantity INTEGER NOT NULL CHECK (available_quantity >= 0),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Constraint to ensure available items do not exceed the total.
    CONSTRAINT check_available_quantity CHECK (available_quantity <= total_quantity)
);

-- Trigger to automatically update the `updated_at` timestamp on changes.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_school_inventory_updated_at
BEFORE UPDATE ON school_inventory
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- This table tracks the running total of items issued to a faculty member.
CREATE TABLE inventory_transactions (
    id SERIAL PRIMARY KEY,
    
    -- Foreign key to the item being issued
    item_id INTEGER NOT NULL REFERENCES school_inventory(id) ON DELETE CASCADE,
    
    -- Foreign key to the faculty member
    faculty_id INTEGER NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    
    -- The CURRENT number of units issued to this faculty member.
    quantity_issued INTEGER NOT NULL CHECK (quantity_issued >= 0),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- CRITICAL: This constraint is required for the ON CONFLICT logic to work.
    -- It ensures a faculty member can only have one "running total" record for each item type.
    UNIQUE (item_id, faculty_id)
);

-- Recommended trigger to automatically update the `updated_at` timestamp.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_inventory_transactions_updated_at
BEFORE UPDATE ON inventory_transactions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Table 1: Defines the different types of fees for each class. (No Changes)
CREATE TABLE fee_types (
    id SERIAL PRIMARY KEY,
    
    -- The name of the fee, e.g., 'Annual Tuition Fee', 'Library Fee'
    fee_name VARCHAR(255) NOT NULL,
    
    -- Foreign key to link this fee to a specific class
    class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    
    -- The total amount to be paid for this fee
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- A class cannot have the same fee type defined twice.
    UNIQUE (class_id, fee_name)
);

-- Table 2: Tracks every single payment transaction made by a student. (UPDATED)
CREATE TABLE fee_payments (
    id SERIAL PRIMARY KEY,
    
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    
    -- 'fee_type_id' has been removed as payment is collected against the total balance.
    
    amount_paid NUMERIC(10, 2) NOT NULL CHECK (amount_paid > 0),
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    payment_mode VARCHAR(50) CHECK (payment_mode IN ('Cash', 'UPI', 'Cheque', 'Card')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Recommended trigger for the fee_types table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_fee_types_updated_at
BEFORE UPDATE ON fee_types
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- This table stores details for each school bus, its route, and its staff.
CREATE TABLE transport (
    id SERIAL PRIMARY KEY,
    
    route_name VARCHAR(255) NOT NULL,
    bus_no VARCHAR(20) UNIQUE NOT NULL,
    
    -- Vehicle & Staff Details
    driver_name VARCHAR(255) NOT NULL,
    driver_mobile_no VARCHAR(15) NOT NULL,
    driver_licence_no VARCHAR(50) UNIQUE NOT NULL,
    
    conductor_name VARCHAR(255), -- Optional
    conductor_mobile_no VARCHAR(15), -- Optional
    
    -- Compliance Details
    insurance_due_date DATE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Recommended trigger to automatically update the `updated_at` timestamp on changes.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_transport_updated_at
BEFORE UPDATE ON transport
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- This table maps students to specific transport routes.
CREATE TABLE transport_assignments (
    id SERIAL PRIMARY KEY,
    
    -- Foreign key to the student. UNIQUE ensures a student can only be on one route.
    student_id INTEGER UNIQUE NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    
    -- Foreign key to the transport route/bus.
    transport_id INTEGER NOT NULL REFERENCES transport(id) ON DELETE CASCADE,
    
    -- The specific fee amount for this student on this route.
    fee_amount NUMERIC(10, 2) NOT NULL CHECK (fee_amount >= 0),
        
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- This table stores all school holidays, including single-day holidays and longer vacations.
CREATE TABLE holidays (
    id SERIAL PRIMARY KEY,
    
    name VARCHAR(255) NOT NULL,
    
    -- If start_date and end_date are the same, it implies a single-day holiday.
    -- If they are different, it implies a multi-day vacation.
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    -- Timestamps for auditing
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- A database-level check to ensure the end date is not before the start date.
    CONSTRAINT check_date_range CHECK (end_date >= start_date)
);

-- Recommended trigger to automatically update the `updated_at` timestamp on any changes.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_holidays_updated_at
BEFORE UPDATE ON holidays
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- CREATE TABLE "Student" (
--     "id" TEXT PRIMARY KEY DEFAULT 'cuid_' || substr(md5(random()::text), 1, 16),
--     "name" TEXT NOT NULL,
--     "class" TEXT NOT NULL,
--     "division" TEXT NOT NULL,
--     "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- CREATE TABLE "Staff" (
--     "id" TEXT PRIMARY KEY DEFAULT 'cuid_' || substr(md5(random()::text), 1, 16),
--     "name" TEXT NOT NULL,
--     "subject" TEXT NOT NULL,
--     "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );
