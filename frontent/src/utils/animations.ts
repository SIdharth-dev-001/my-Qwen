export const pageTransition: any = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: 'easeIn' } }
};

export const sidebarTransition: any = {
  open: { width: '280px', transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  closed: { width: '72px', transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
};

export const chatBubbleEntrance: any = {
  initial: { opacity: 0, y: 15, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
};

export const staggerContainer: any = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

export const cardHoverTransition: any = {
  whileHover: { y: -4, scale: 1.02, transition: { duration: 0.2, ease: 'easeOut' } },
  whileTap: { scale: 0.98 }
};

export const modalEntrance: any = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2, ease: 'easeIn' } }
};

export const backdropAnimation: any = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};
