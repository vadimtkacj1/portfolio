const NavLink = ({ href, children, onClick }) => (
    <a
        href={href}
        onClick={onClick}
        className="relative px-4 py-2 text-gray-300 hover:text-white transition-all duration-300 group"
    >
        {children}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
    </a>
);

export default NavLink;
