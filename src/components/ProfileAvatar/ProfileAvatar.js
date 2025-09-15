import personalImage from "../../images/personal_image.jfif";

const ProfileAvatar = () => (
    <div className="relative w-64 h-64 mx-auto mb-8">
        <div
            className="absolute inset-0 rounded-full p-1"
            style={{
                background: "linear-gradient(180deg, #00b7ff, #ff30ff)",
            }}
        >
            <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center overflow-hidden">
                <img
                    src={personalImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    </div>
);

export default ProfileAvatar;
