import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

export function LinkStudents () {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) {
      navigate("/dashboard/teachers"); // redireciona se não houver id
    }
  }, [id, navigate]);

  return (
    <div>
      <h1>Vincular alunos ao professor {id}</h1>
    </div>
  );
};