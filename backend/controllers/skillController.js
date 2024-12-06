import Skill from "../models/skillModel.js";

// make a getAllSKills function
export const getAllSkills = async (req, res) => {
    try {
        const skills = await Skill.find();
        res.status(200).json(skills);
    } catch (error) {
        console.log("Error getting skills:", error);
        res.status(500).json({ message: "Failed to get skills", error });
    }
    }
// make a getSkillById function
export const getSkillById = async (req, res) => {
    const { id } = req.params;

    try {
        const skill = await Skill.findById(id);
        if (skill) {
            res.status(200).json(skill);
        } else {
            res.status(404).json({ message: "Skill not found" });
        }
    }
    catch (error) {
        console.log("Error getting skill:", error);
        res.status(500).json({ message: "Failed to get skill", error });
    }
    }