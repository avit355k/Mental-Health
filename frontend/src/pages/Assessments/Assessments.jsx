import React from "react";
import AssessmentCard from "../../components/assessments/AssessmentCard";
import assessmentsData from "../../components/assessments/assessmentsData";

const Assessments = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-6">
      
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-emerald-500">
          Mental Health Assessments
        </h1>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          Take validated psychological assessments to understand your mental
          health status. Your results are private and saved to your profile.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {assessmentsData.map((assessment) => (
          <AssessmentCard
            key={assessment.id}
            {...assessment}
          />
        ))}
      </div>
    </section>
  );
};

export default Assessments;
