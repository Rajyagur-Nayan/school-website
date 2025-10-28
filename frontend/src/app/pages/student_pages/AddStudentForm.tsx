"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Loader2, User, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Define a type for the class data
interface Class {
  id: number;
  standard: string;
  division: string;
}

export function AddStudentForm() {
  // State for all form fields
  const [formData, setFormData] = useState({
    admission_number: "",
    student_name: "",
    place_of_birth: "",
    gender: "",
    blood_group: "",
    nationality: "Indian",
    religion: "",
    cast_category: "",
    community: "",
    class_id: "",
    admission_date: format(new Date(), "yyyy-MM-dd"),
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
    father_name: "",
    mother_name: "",
    parent_primary_phone: "",
    parent_secondary_phone: "", // --- 1. ADDED ---
    parent_email: "", // --- 1. ADDED ---
  });
  const [dob, setDob] = useState<Date>();

  // State for files
  const [studentPhoto, setStudentPhoto] = useState<File | null>(null);
  const [fatherPhoto, setFatherPhoto] = useState<File | null>(null);
  const [motherPhoto, setMotherPhoto] = useState<File | null>(null);

  // State for photo previews
  const [studentPhotoPreview, setStudentPhotoPreview] = useState<string | null>(
    null
  );
  const [fatherPhotoPreview, setFatherPhotoPreview] = useState<string | null>(
    null
  );
  const [motherPhotoPreview, setMotherPhotoPreview] = useState<string | null>(
    null
  );

  const [classes, setClasses] = useState<Class[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch classes and last admission number on component load
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/add_slot/form-data`,
          { withCredentials: true }
        );
        setClasses(response.data.classes || []);
      } catch (error) {
        console.log(error);
        toast.error("Could not fetch class list.");
      }
    };

    const fetchLastAdmissionNumber = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/add_student/last-admission-number`,
          { withCredentials: true }
        );
        const lastNumber = parseInt(response.data.next_student_id);
        setFormData((prev) => ({
          ...prev,
          admission_number: String(lastNumber),
        }));
      } catch (error) {
        console.log(error);
        toast.error("Could not fetch next admission number.");
      }
    };

    fetchClasses();
    fetchLastAdmissionNumber();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);

      if (name === "student_photo") {
        setStudentPhoto(file);
        if (studentPhotoPreview) URL.revokeObjectURL(studentPhotoPreview);
        setStudentPhotoPreview(previewUrl);
      } else if (name === "father_photo") {
        setFatherPhoto(file);
        if (fatherPhotoPreview) URL.revokeObjectURL(fatherPhotoPreview);
        setFatherPhotoPreview(previewUrl);
      } else if (name === "mother_photo") {
        setMotherPhoto(file);
        if (motherPhotoPreview) URL.revokeObjectURL(motherPhotoPreview);
        setMotherPhotoPreview(previewUrl);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    // Append all form data
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    // Append date
    if (dob) {
      data.append("date_of_birth", format(dob, "yyyy-MM-dd"));
    }
    // Append files
    if (studentPhoto) data.append("student_photo", studentPhoto);
    if (fatherPhoto) data.append("father_photo", fatherPhoto);
    if (motherPhoto) data.append("mother_photo", motherPhoto);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/add_student`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      toast.success("Student admitted successfully!");
      // Optionally reset the form here
    } catch (error) {
      console.error("Error admitting student:", error);
      toast.error("Failed to admit student.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Increased max-width to fit the new fields comfortably
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Student Admission Form</CardTitle>
        <CardDescription>
          Fill in the details to admit a new student.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Accordion
            type="multiple"
            defaultValue={["student-details"]}
            className="w-full"
          >
            {/* --- Section 1: Student Details & Photos --- */}
            <AccordionItem value="student-details">
              <AccordionTrigger>1. Student Details & Photos</AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center p-4 bg-muted/50 rounded-lg">
                  <div className="flex flex-col items-center space-y-2">
                    <Label htmlFor="student_photo">Student Photo</Label>
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={studentPhotoPreview || ""} />
                      <AvatarFallback>
                        <User className="h-10 w-10" />
                      </AvatarFallback>
                    </Avatar>
                    <Input
                      id="student_photo"
                      name="student_photo"
                      type="file"
                      onChange={handleFileChange}
                      className="text-xs"
                    />
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <Label htmlFor="father_photo">Father&apos;s Photo</Label>
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={fatherPhotoPreview || ""} />
                      <AvatarFallback>
                        <Users className="h-10 w-10" />
                      </AvatarFallback>
                    </Avatar>
                    <Input
                      id="father_photo"
                      name="father_photo"
                      type="file"
                      onChange={handleFileChange}
                      className="text-xs"
                    />
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <Label htmlFor="mother_photo">Mother&apos;s Photo</Label>
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={motherPhotoPreview || ""} />
                      <AvatarFallback>
                        <Users className="h-10 w-10" />
                      </AvatarFallback>
                    </Avatar>
                    <Input
                      id="mother_photo"
                      name="mother_photo"
                      type="file"
                      onChange={handleFileChange}
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Student Full Name</Label>
                    <Input
                      name="student_name"
                      value={formData.student_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select
                      name="gender"
                      onValueChange={(value) =>
                        handleSelectChange("gender", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      name="date_of_birth"
                      value={dob ? format(dob, "yyyy-MM-dd") : ""}
                      onChange={(e) => setDob(new Date(e.target.value))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Blood Group</Label>
                    <Select
                      name="blood_group"
                      onValueChange={(value) =>
                        handleSelectChange("blood_group", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                          (bg) => (
                            <SelectItem key={bg} value={bg}>
                              {bg}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* --- Section 2: Demographic Details --- */}
            <AccordionItem value="demographics">
              <AccordionTrigger>2. Demographic Details</AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Place of Birth</Label>
                    <Input
                      name="place_of_birth"
                      value={formData.place_of_birth}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nationality</Label>
                    <Input
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Religion</Label>
                    <Input
                      name="religion"
                      value={formData.religion}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Caste Category</Label>
                    <Select
                      name="cast_category"
                      onValueChange={(value) =>
                        handleSelectChange("cast_category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="OBC">OBC</SelectItem>
                        <SelectItem value="SC">SC</SelectItem>
                        <SelectItem value="ST">ST</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Community</Label>
                    <Input
                      name="community"
                      value={formData.community}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* --- Section 3: Academic Details --- */}
            <AccordionItem value="academic">
              <AccordionTrigger>3. Academic Details</AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Admission Number</Label>
                    <Input
                      name="admission_number"
                      value={formData.admission_number}
                      onChange={handleInputChange}
                      readOnly
                      required
                      className="bg-gray-100 dark:bg-gray-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Admission Date</Label>
                    <Input
                      name="admission_date"
                      type="date"
                      value={formData.admission_date}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Class</Label>
                    <Select
                      name="class_id"
                      onValueChange={(value) =>
                        handleSelectChange("class_id", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.standard}-{c.division}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* --- Section 4: Parent & Address Details --- */}
            <AccordionItem value="contact">
              <AccordionTrigger>4. Parent & Address Details</AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Father&apos;s Name</Label>
                    <Input
                      name="father_name"
                      value={formData.father_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mother&apos;s Name</Label>
                    <Input
                      name="mother_name"
                      value={formData.mother_name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* --- 2. ADDED NEW FIELDS IN A GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Parent&apos;s Primary Phone</Label>
                    <Input
                      name="parent_primary_phone"
                      type="tel"
                      value={formData.parent_primary_phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Parent&apos;s Secondary Phone</Label>
                    <Input
                      name="parent_secondary_phone"
                      type="tel"
                      value={formData.parent_secondary_phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Parent&apos;s Email</Label>
                    <Input
                      name="parent_email"
                      type="email"
                      value={formData.parent_email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                {/* ------------------------------------ */}

                <div className="space-y-2">
                  <Label>Address Line 1</Label>
                  <Textarea
                    name="address_line1"
                    value={formData.address_line1}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address Line 2</Label>
                  <Textarea
                    name="address_line2"
                    value={formData.address_line2}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pincode</Label>
                    <Input
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* --- Submit Button --- */}
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting} size="lg">
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Admitting..." : "Admit Student"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
