import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Linkedin, Mail } from "lucide-react";

const teamMembers = [
  {
    name: "Alex van der Meer",
    role: "Founder & CEO",
    image: "/person.png",
    bio: "Passie voor technologie en ondernemerschap",
  },
  {
    name: "Emma Bakker",
    role: "Head of Design",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    bio: "Creatieve visie voor moderne websites",
  },
  {
    name: "Thomas de Wit",
    role: "Lead Developer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    bio: "Expert in AI en web development",
  },
];

export const Team = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Team
          </span>
          <motion.h2 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Ontmoet het team achter{" "}
            <span className="text-gradient">Nexavo</span>
          </motion.h2>
          <p className="text-lg text-muted-foreground">
            Een gepassioneerd team dat jouw online succes mogelijk maakt.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background rounded-2xl p-8 shadow-card border border-border/50 text-center"
            >
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={member.image} alt={member.name} />
                <AvatarFallback className="text-xl">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
              <p className="text-primary font-medium mb-3">{member.role}</p>
              <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
              <div className="flex items-center justify-center gap-3">
                <a
                  href="#"
                  className="w-9 h-9 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                  aria-label={`LinkedIn van ${member.name}`}
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                  aria-label={`Email ${member.name}`}
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

