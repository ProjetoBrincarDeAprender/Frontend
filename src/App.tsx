import { BiHome } from "react-icons/bi";
import { Header } from "./components/Header/Header";
import { Button } from "./components/utils/Button/Button";

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
    </>
  );
}

export default App;
