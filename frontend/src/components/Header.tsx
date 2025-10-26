import Logo from "./Logo";
import Avatar from "./Avatar";

const Header = () => {
  return (
    <header>
      <div className="border-b border-black/10 flex justify-between  p-4 items-center">
        <div>
          <Logo />
        </div>
        <div>
          <Avatar />
        </div>
      </div>
    </header>
  );
};

export default Header;
