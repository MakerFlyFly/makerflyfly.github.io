"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import {
  buttonTap,
  cardReveal,
  motionViewport,
  pageEnter,
} from "@/lib/motion-presets";

type AnimatedSectionProps = HTMLMotionProps<"section"> & {
  delay?: number;
  inView?: boolean;
};

type AnimatedDivProps = HTMLMotionProps<"div"> & {
  delay?: number;
  inView?: boolean;
};

type MotionCardProps = HTMLMotionProps<"article"> & {
  delay?: number;
  interactive?: boolean;
};

export function AnimatedPage({
  delay = 0,
  children,
  ...props
}: AnimatedSectionProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.section {...pageEnter(Boolean(reducedMotion), delay)} {...props}>
      {children}
    </motion.section>
  );
}

export function AnimatedSection({
  delay = 0,
  inView = true,
  children,
  ...props
}: AnimatedSectionProps) {
  const reducedMotion = useReducedMotion();
  const revealProps = cardReveal(Boolean(reducedMotion), delay);

  return (
    <motion.section
      {...revealProps}
      animate={inView ? undefined : revealProps.whileInView}
      viewport={inView ? motionViewport : undefined}
      {...props}
    >
      {children}
    </motion.section>
  );
}

export function AnimatedDiv({
  delay = 0,
  inView = false,
  children,
  ...props
}: AnimatedDivProps) {
  const reducedMotion = useReducedMotion();
  const revealProps = cardReveal(Boolean(reducedMotion), delay);

  return (
    <motion.div
      {...revealProps}
      animate={inView ? undefined : revealProps.whileInView}
      viewport={inView ? motionViewport : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionCard({
  delay = 0,
  interactive = true,
  children,
  ...props
}: MotionCardProps) {
  const reducedMotion = useReducedMotion();
  const revealProps = cardReveal(Boolean(reducedMotion), delay);
  const tapProps = interactive ? buttonTap(Boolean(reducedMotion)) : {};
  const hoverProps =
    "whileHover" in tapProps
      ? { whileHover: tapProps.whileHover, whileTap: tapProps.whileTap }
      : {};

  return (
    <motion.article
      {...revealProps}
      {...hoverProps}
      viewport={motionViewport}
      {...props}
    >
      {children}
    </motion.article>
  );
}

export function MotionButton({
  children,
  ...props
}: HTMLMotionProps<"button">) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.button {...buttonTap(Boolean(reducedMotion))} {...props}>
      {children}
    </motion.button>
  );
}

export function MotionLabel({
  children,
  ...props
}: HTMLMotionProps<"label">) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.label {...buttonTap(Boolean(reducedMotion))} {...props}>
      {children}
    </motion.label>
  );
}
