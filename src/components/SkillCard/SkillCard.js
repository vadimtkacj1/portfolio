const SkillCard = ({ icon: Icon, title, description, color }) => (
    <div className="bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition-all duration-300 hover:scale-105">
        <Icon className={`w-8 h-8 ${color} mb-4`} />
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
    </div>
);

export default SkillCard;
