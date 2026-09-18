import { motion, useReducedMotion } from 'framer-motion';
import ShinyText from '@/components/ShinyText';

const capabilities = [
  {
    title: 'Control systems',
    body: 'Cascade PID with inner and outer loop design, tuned through simulation and validated in live flight.',
  },
  {
    title: 'Sensing and data fusion',
    body: 'LiDAR, depth camera, IMU and wheel encoders fused into one estimate the robot can act on.',
  },
  {
    title: 'Real-time and embedded',
    body: 'Linux systems on Jetson Xavier and Raspberry Pi, from sensor read through to actuator command.',
  },
  {
    title: 'Perception',
    body: 'OpenCV, YOLO and TensorFlow pipelines trained for one specific line, then deployed to run at the edge.',
  },
];

const About = () => {
  const reduce = useReducedMotion();

  const reveal = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    <section id="about" className="band">
      <div className="shell">
        <motion.h2 {...reveal} className="display max-w-[16ch] text-4xl font-semibold md:text-5xl lg:text-6xl">
          <ShinyText
            text="Robotics that has to work outside the lab"
            speed={3.6}
            delay={4.5}
            spread={110}
            disabled={Boolean(reduce)}
          />
        </motion.h2>

        <motion.div {...reveal} className="mt-10 grid gap-8 md:grid-cols-2 md:gap-12">
          <p className="max-w-[62ch] text-lg leading-relaxed text-muted-foreground">
            I design, develop and integrate robotic and automation systems from prototype through to deployment, on
            industrial lines and on mobile platforms. That means control design and tuning, multi-sensor fusion, and
            real-time embedded work on Linux.
          </p>
          <p className="max-w-[62ch] text-lg leading-relaxed text-muted-foreground">
            I have taken control algorithms the whole way, from simulation to live testing on real hardware, including
            flight tests on a drone and deployment on a working mobile robot. My research interest is human-robot
            interaction, and I am extending the same principles toward space robotics.
          </p>
        </motion.div>

        <div className="mt-20 grid gap-x-12 md:grid-cols-2">
          {capabilities.map((item, index) => (
            <motion.div
              key={item.title}
              {...(reduce
                ? {}
                : {
                    initial: { opacity: 0, y: 16 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, amount: 0.4 },
                    transition: { duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] as const },
                  })}
              className="border-t border-border py-7"
            >
              <h3 className="text-base font-semibold">{item.title}</h3>
              <p className="mt-2 max-w-[48ch] text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
