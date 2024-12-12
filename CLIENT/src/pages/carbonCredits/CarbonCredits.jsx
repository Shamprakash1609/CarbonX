import CCCalculator from "./ccComponents/Calculator/CCCalculator";
import CCChallenges from "./ccComponents/challenges/CCChallenges";
import CCHeader from "./ccComponents/header/CCHeader";
import CCInfo from "./ccComponents/Info/CCInfo";
import Footer from "../../components/footer/Footer";

const CarbonCredits = () => {
  return (
    <div>
      <CCHeader />
      <CCInfo/>
      <CCChallenges/>
      <CCCalculator/>
      <Footer/>
    </div>
  );
};

export default CarbonCredits;

