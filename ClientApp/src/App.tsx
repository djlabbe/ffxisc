import { Container } from "@chakra-ui/react";
import BluGuide from "./BluGuide";
import WSCalc from "./WSCalc";

function App() {
  return (
    <Container maxW={"5xl"}>
      {/* <BluGuide /> */}
      <WSCalc />
    </Container>
  );
}

export default App;
