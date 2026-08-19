import os, sys
import part1, part2, content

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "Forrest Mims - 555 Timer IC Circuits")
os.makedirs(OUT, exist_ok=True)

made = []
for fn in part1.BUILD + part2.BUILD:
    name, cir = fn()
    content.apply(cir, name)
    path = os.path.join(OUT, name + ".txt")
    cir.write(path)
    made.append((name, len(cir.parts)))
    print("%-38s %3d elements" % (name, len(cir.parts)))
print("\n%d circuits written to %s" % (len(made), OUT))
