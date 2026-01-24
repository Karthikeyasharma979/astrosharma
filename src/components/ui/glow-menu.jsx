import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useTheme } from "../../context/ThemeContext"

const itemVariants = {
    initial: { rotateX: 0, opacity: 1 },
    hover: { rotateX: -90, opacity: 0 },
}

const backVariants = {
    initial: { rotateX: 90, opacity: 0 },
    hover: { rotateX: 0, opacity: 1 },
}

const glowVariants = {
    initial: { opacity: 0, scale: 0.8 },
    hover: {
        opacity: 1,
        scale: 2,
        transition: {
            opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
            scale: { duration: 0.5, type: "spring", stiffness: 300, damping: 25 },
        },
    },
}

const navGlowVariants = {
    initial: { opacity: 0 },
    hover: {
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
        },
    },
}

const sharedTransition = {
    type: "spring",
    stiffness: 100,
    damping: 20,
    duration: 0.5,
}

export const MenuBar = React.forwardRef(
    ({ className, items, activeItem, onItemClick, leading, trailing, ...props }, ref) => {
        const { theme } = useTheme();
        const isDarkTheme = theme === 'dark';

        return (
            <motion.nav
                ref={ref}
                className={cn(
                    "p-2 rounded-2xl bg-white/80 dark:bg-[#0B0F19] backdrop-blur-md border border-gray-200 dark:border-white/20 shadow-lg relative overflow-hidden flex items-center justify-between transition-colors duration-300 gap-4",
                    className,
                )}
                initial="initial"
                whileHover="hover"
                {...props}
            >
                <div className="flex items-center gap-4 relative z-10 w-full justify-between">
                    {leading && <div className="pl-4 pr-2 flex-shrink-0">{leading}</div>}

                    <ul className="flex items-center gap-2 relative z-10">
                        {items.map((item) => {
                            const Icon = item.icon
                            const isActive = item.label === activeItem

                            return (
                                <motion.li key={item.label} className="relative">
                                    <button
                                        onClick={() => onItemClick?.(item)}
                                        className="block w-full"
                                    >
                                        <motion.div
                                            className="block rounded-xl overflow-visible group relative"
                                            style={{ perspective: "600px" }}
                                            whileHover="hover"
                                            initial="initial"
                                        >
                                            <motion.div
                                                className="absolute inset-0 z-0 pointer-events-none"
                                                variants={glowVariants}
                                                animate={isActive ? "hover" : "initial"}
                                                style={{
                                                    background: item.gradient,
                                                    opacity: isActive ? 1 : 0,
                                                    borderRadius: "16px",
                                                }}
                                            />
                                            <motion.div
                                                className={cn(
                                                    "flex items-center gap-2 px-4 py-2 relative z-10 bg-transparent transition-colors rounded-xl",
                                                    isActive
                                                        ? "text-gray-900 dark:text-white"
                                                        : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white",
                                                )}
                                                variants={itemVariants}
                                                transition={sharedTransition}
                                                style={{
                                                    transformStyle: "preserve-3d",
                                                    transformOrigin: "center bottom",
                                                }}
                                            >
                                                <span
                                                    className={cn(
                                                        "transition-colors duration-300",
                                                        isActive ? item.iconColor : "text-gray-500 dark:text-white",
                                                        `group-hover:${item.iconColor}`,
                                                    )}
                                                >
                                                    <Icon className="h-5 w-5" />
                                                </span>
                                                <span className="whitespace-nowrap">{item.label}</span>
                                            </motion.div>
                                            <motion.div
                                                className={cn(
                                                    "flex items-center gap-2 px-4 py-2 absolute inset-0 z-10 bg-transparent transition-colors rounded-xl",
                                                    isActive
                                                        ? "text-gray-900 dark:text-white"
                                                        : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white",
                                                )}
                                                variants={backVariants}
                                                transition={sharedTransition}
                                                style={{
                                                    transformStyle: "preserve-3d",
                                                    transformOrigin: "center top",
                                                    rotateX: 90,
                                                }}
                                            >
                                                <span
                                                    className={cn(
                                                        "transition-colors duration-300",
                                                        isActive ? item.iconColor : "text-gray-500 dark:text-white",
                                                        `group-hover:${item.iconColor}`,
                                                    )}
                                                >
                                                    <Icon className="h-5 w-5" />
                                                </span>
                                                <span className="whitespace-nowrap">{item.label}</span>
                                            </motion.div>
                                        </motion.div>
                                    </button>
                                </motion.li>
                            )
                        })}
                    </ul>

                    {trailing && <div className="pl-2 pr-4 relative z-10 flex-shrink-0">{trailing}</div>}
                </div>

                <motion.div
                    className={`absolute -inset-2 bg-gradient-radial from-transparent ${isDarkTheme
                        ? "via-blue-400/30 via-30% via-purple-400/30 via-60% via-red-400/30 via-90%"
                        : "via-orange-400/20 via-30% via-red-400/20 via-60% via-yellow-400/20 via-90%"
                        } to-transparent rounded-3xl z-0 pointer-events-none`}
                    variants={navGlowVariants}
                />
            </motion.nav>
        )
    }
)

MenuBar.displayName = "MenuBar"
