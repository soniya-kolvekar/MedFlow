"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProfileEdit from "@/components/dashboard/ProfileEdit";
import { motion } from "framer-motion";

export default function GlobalProfilePage() {
    return (
        <DashboardLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
            >
                <ProfileEdit />
            </motion.div>
        </DashboardLayout>
    );
}
