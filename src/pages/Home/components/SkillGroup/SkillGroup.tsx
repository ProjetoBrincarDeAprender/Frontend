import { Card } from "../../../../components/utils/Card/Card";
import "./SkillGroup.css";

interface SkillGroupProps {
  className?: string;
}

export function SkillGroup({ className = "" }: SkillGroupProps) {
  return (
    <section className={`${className} bg-[#D9D9D9] py-32`}>
      <div className="text-center">
        <h2 className="title-skillgroup font-1 text-4xl font-bold text-gray-800">
          HABILIDADES DESENVOLVIDAS
        </h2>
      </div>
      <div className="flex px-8 py-16">
        <Card title="Em Breve" variant="skill" disabled />
        <Card title="Em Breve" variant="skill" disabled />
        <Card title="Em Breve" variant="skill" disabled />
      </div>
    </section>
  );
}
