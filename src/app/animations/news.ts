import { AnimationController, Animation } from '@ionic/angular';

export const transition = (baseEl: HTMLElement, opts?: any): Animation => {

    const animationCtrl = new AnimationController();

    if (opts.direction === 'forward') {

        const enteringAnimation = animationCtrl.create()
            .addElement(opts.enteringEl)
            .duration(500)
            .easing('cubic-bezier(0.32,0.72,0,1)')
            .beforeStyles({opacity: 1})
            .fromTo('transform', 'translateX(100vw)', 'translateX(0vw)');

        return animationCtrl.create()
            .addAnimation([enteringAnimation]);

    } else {

        const leavingAnimation = animationCtrl.create()
            .addElement(opts.leavingEl)
            .duration(400)
            .easing('cubic-bezier(0.32,0.72,0,1)')
            .beforeStyles({opacity: 1})
            .fromTo('transform', 'translateX(0vw)', 'translateX(100vw)');

        const appearingAnimation = animationCtrl.create()
            .addElement(opts.enteringEl)
            .duration(400)
            .beforeStyles({opacity: 1});

        return animationCtrl.create()
            .addAnimation([leavingAnimation, appearingAnimation]);
    }
};
