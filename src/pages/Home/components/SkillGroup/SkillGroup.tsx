import { Card } from "../../../../components/utils/Card/Card";
import "./SkillGroup.css";

interface SkillGroupProps {
  className?: string;
}

export function SkillGroup({ className = "" }: SkillGroupProps) {
  return (
    <section className={`${className} bg-blue-50 py-32`}>
      <div className="text-center">
        <h2 className="title-skillgroup font-1 font-bold text-4xl text-gray-800">
          HABILIDADES DESENVOLVIDAS
        </h2>
      </div>
      <div className="flex px-8 py-16">
        <Card gameIdUrl="4" title="Mamemática" variant="skill" />
        <Card gameIdUrl="5" title="Português" variant="skill" />
        <Card gameIdUrl="6" title="Geografia" variant="skill" />
      </div>
    </section>
  );
}
