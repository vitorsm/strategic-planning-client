import { VisualUser } from "../../features/users/types";
import { User } from "../models/user";


export const getVisualUser = (user: User): VisualUser => {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444'];
    const userId = user.id ?? '';
    const color = colors[userId.charCodeAt(0) % colors.length];
    return { ...user, color };
};
