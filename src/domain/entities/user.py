from pydantic import BaseModel
from typing import Any, List, Optional


class User(BaseModel):
    user_id: str | None = None
    username: str | None = None


class UserBase(BaseModel):
    membername: str | None = None
    memberpass: str | None = None


class UserData(BaseModel):
    id: Optional[int] = None
    user_id: Optional[str] = None
    visitId: Optional[str] = None
    mrn: Optional[str] = None
    details: Optional[List[str]] = None
    patient_name: Optional[str] = None
    timestamp: Optional[str] = None
    date: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    prev: Optional[List[dict]] = None


class Prev(BaseModel):
    privJson: str | None = None
    privSpeakerId: str | None = None


class PatientData(BaseModel):
    detail: str | None = None
    details: list[str] | None = None
    visitId: str | None = None
    mrn: str | None = None
    date: str | None = None
    patient_name: str | None = None
    timestamp: str | None = None
    date: str | None = None
    dob: str | None = None
    gender: str | None = None
    prev: list[Prev] | None = None


class VitalSigns(BaseModel):
    Heart_Rate: Optional[str]
    Temperature: Optional[str]
    Blood_Pressure: Optional[str]
    Respiratory_Rate: Optional[str]
    Oxygen_Saturation: Optional[str]


class Problem(BaseModel):
    Problem_Number: int
    Problem_Description: str


class Assessment(BaseModel):
    ProblemList: List[Problem]
    Assessment_Description: str
    Differential_Diagnoses: List[str]


class TreatmentPlan(BaseModel):
    Pharmacotherapy: str
    Patient_Education: str
    Other_Therapeutic_Procedures: str


class Plan(BaseModel):
    Treatment_Plan: TreatmentPlan
    Diagnostic_Plan: str
    FollowUp: str | None = None


class Objective(BaseModel):
    Lab_Data: str
    VitalSigns: VitalSigns
    Physical_Exam: str


class Subjective(BaseModel):
    History_of_PresentIllness: str
    Review_of_Systems: str
    Current_Medications: List[dict]
    Pertinent_Past_MedicalHistory: str
    Medication_Allergies: str | None = None
    Family_History: str | None = None
    Social_History: str | None = None


class Summary(BaseModel):
    Plan: Plan
    Summary: str | None = None
    Objective: Objective
    Assessment: Assessment
    Subjective: Subjective


class PatientDataUpdate(BaseModel):
    visitId: str | None = None
    details: List[str]
    summary: Summary | None = None


class PatientDataSummary(BaseModel):
    visitId: str
    details: Any
    summary: Any
