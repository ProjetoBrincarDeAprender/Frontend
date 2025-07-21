import { BiHome } from "react-icons/bi";
import { Header } from "./components/Header/Header";
import { Button } from "./components/utils/Button/Button";
import { Link } from "./components/utils/Link/Link";

function App() {
  return (
    <>
      <Header username="Deivid" />
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
      <Link href="/" variant="primary">
        Teste
      </Link>
      <Link href="/" variant="light">
        Teste
      </Link>
      <Link href="/" variant="dark">
        Teste
      </Link>
    </>
  );
}

export default App;
