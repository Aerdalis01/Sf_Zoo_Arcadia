import React, { useState } from "react";
import { Sidebar } from "../controllers/components/user-space/Sidebar";
import { Content } from "../controllers/components/user-space/Content"; 

export const DashboardPage: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<string>("");

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
  };

  return (
    <div className="dashboard-container d-flex">
      <Sidebar onSectionChange={handleSectionChange} />
      
      <Content section={currentSection} />
    </div>
  );
};