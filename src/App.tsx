import { BiHome } from "react-icons/bi";
import { Header } from "./components/Header/Header";
import { Button } from "./components/utils/Button/Button";
import { Link } from "./components/utils/Link/Link";
import { Input } from "./components/utils/Input/Input";
function App() {
  return (
    <>
      <Header username="Deivid" />
      <h1 className="text-red-600">--- Button Components Below ---</h1>
      <Button variant="primary" size="lg">
        <BiHome /> Primary
      </Button>
      <Button variant="warning" size="lg">
        <BiHome /> Warning
      </Button>
      <Button variant="light" size="lg">
        <BiHome /> Light
      </Button>
      <Button variant="dark" size="lg">
        <BiHome /> Dark
      </Button>
      <h1 className="text-red-600">--- Link Components Below ---</h1>
      <Link href="/" variant="primary">
        Teste
      </Link>
      <Link href="/" variant="light">
        Teste
      </Link>
      <Link href="/" variant="dark">
        Teste
      </Link>
      <h1 className="text-red-600">--- Input Components Below ---</h1>
      <Input
        type="email"
        inputSize="sm"
        variant="primary"
        label="Seu Email Aqui"
      />
      <Input
        type="email"
        inputSize="md"
        variant="light"
        label="Seu Email Aqui"
      />
      <Input
        type="email"
        inputSize="lg"
        variant="dark"
        label="Seu Email Aqui"
      />
    </>
  );
}

export default App;
