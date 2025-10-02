import Navbar from "../Navbar";

export default function NavbarExample() {
  return <Navbar onCTAClick={() => console.log("Navbar CTA clicked")} />;
}
