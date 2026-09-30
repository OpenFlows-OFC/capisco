"""
CAPISCO · Capi 3D (Blender 5.x)
Gera a Capi (capivara mascote) com 6 expressões e 8 roupas por matéria,
a partir das mesmas proporções do SVG em ../../capi.js.

Uso dentro do Blender (Text Editor ou MCP):
    g = {}; exec(open(r".../capi_build.py", encoding="utf-8").read(), g)
    g["build"]()                         # reconstrói a cena inteira
    g["set_state"]("feliz", "bio")       # troca expressão / roupa
    g["render_batch"](r".../capi3d")     # renderiza PNGs com fundo transparente

Convenções: 1 unidade = 100 px do viewBox 240x250 do SVG, chão em z=0,
a Capi olha para -Y. P(x, y) converte coordenadas do SVG para (X, Z).
"""
import bpy, bmesh, math, os
from mathutils import Vector, Matrix, Quaternion, Euler

ROUPAS = ["nenhuma", "bio", "qui", "fis", "mat", "his", "geo", "por", "red"]
EXPRS = ["neutra", "feliz", "pensando", "quase", "comemora", "dormindo"]

PX = 0.01
EYE_DZ = 0.04          # olhos um pouco acima do SVG para não colidir com o focinho 3D
HEAD_C = Vector((0, -0.12, 1.34))
HEAD_S = Vector((0.76, 0.62, 0.60))
BODY_C = Vector((0, 0.05, 0.62))
BODY_S = Vector((0.80, 0.68, 0.62))
ARM_L = 0.62
PROP_SCALE = 1.3
SHOULDER = Vector((0.58, -0.2, 0.8))

def P(x, y, dz=0.0):
    return ((x - 120) * PX, (236 - y) * PX + dz)

# ------------------------------------------------------------------ cores
COR = dict(
    fur="#c98a4b", arm="#b17a42", belly="#f7cf96", snout="#8f5c33", ear="#8a5a2c", ear_in="#5e3a1a",
    foot="#8a5a2c", ink="#2a1a0e", eye="#ffffff", shine="#ffffff", blush="#ff9d8a", tongue="#ff8f86",
    coat="#f7f9fa", coat_d="#dfe6ea", grey="#c9c5be", blue="#3fa9f5", green="#58b847", green_l="#7ccf5a",
    green_d="#3f8f2f", liquid="#3fcf6a", glass="#cdeeff", dark="#2b2825", lens="#8fd3ff", purple="#8b6cff",
    yellow="#ffc62e", gold="#d99a00", red="#ff5b4f", stem="#7a4d22", coral="#ff7a6b", screen="#e6fff9",
    white="#ffffff", teal="#0fa292", teal_d="#08685e", cream="#f3e2bf", roll="#e9d3a3", brown="#9c6634",
    wax="#b8343a", khaki="#dcbf85", khaki_d="#c9a66b", band="#8a5a2c", pink="#e05c9a", pink_d="#b83e78",
    orange="#ff8f0a", ocean="#3fa9f5", bubble="#e4dfd8", zz="#3fa9f5", paper_line="#3fa9f5", page_line="#8a857d",
)

def lin(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)

MATS = {}

def _bsdf(m):
    try:
        m.use_nodes = True
    except Exception:
        pass
    nt = m.node_tree
    b = next((n for n in nt.nodes if n.type == "BSDF_PRINCIPLED"), None)
    if b is None:
        b = nt.nodes.new("ShaderNodeBsdfPrincipled")
        out = next((n for n in nt.nodes if n.type == "OUTPUT_MATERIAL"), None) or nt.nodes.new("ShaderNodeOutputMaterial")
        nt.links.new(b.outputs[0], out.inputs[0])
    return nt, b

def _set(b, k, v):
    i = b.inputs.get(k)
    if i is not None:
        i.default_value = v

def _blend(m):
    for attr, val in (("surface_render_method", "BLENDED"), ("blend_method", "BLEND")):
        try:
            setattr(m, attr, val)
        except Exception:
            pass

def mat(key, hexc, rough=0.55, spec=0.3, emit=0.0, alpha=1.0, coat=0.0):
    m = bpy.data.materials.new("capi_" + key)
    nt, b = _bsdf(m)
    col = (*lin(hexc), 1.0)
    _set(b, "Base Color", col); _set(b, "Roughness", rough); _set(b, "Specular IOR Level", spec)
    _set(b, "Coat Weight", coat)
    if emit:
        _set(b, "Emission Color", col); _set(b, "Emission Strength", emit)
    if alpha < 1:
        _set(b, "Alpha", alpha); _blend(m)
    m.diffuse_color = col
    MATS[key] = m
    return m

def build_materials():
    MATS.clear()
    special = dict(
        fur=dict(rough=0.75, spec=0.2), arm=dict(rough=0.75, spec=0.2), belly=dict(rough=0.8, spec=0.15),
        snout=dict(rough=0.6, spec=0.25), ink=dict(rough=0.2, spec=0.6, coat=0.4), eye=dict(rough=0.15, spec=0.5, coat=0.6),
        shine=dict(emit=3.0), glass=dict(rough=0.05, spec=0.9, alpha=0.28), lens=dict(rough=0.08, spec=0.8, coat=1.0),
        liquid=dict(rough=0.15, spec=0.6), red=dict(rough=0.3, spec=0.5, coat=0.5), bubble=dict(rough=0.3),
        coat=dict(rough=0.8, spec=0.15), coat_d=dict(rough=0.8, spec=0.15),
    )
    for k, h in COR.items():
        mat(k, h, **special.get(k, {}))
    # bolhas verdes translúcidas
    mat("bolha", COR["liquid"], rough=0.1, spec=0.8, alpha=0.55)
    # globo: oceano + continentes procedurais
    m = bpy.data.materials.new("capi_globo")
    nt, b = _bsdf(m)
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 2.2
    noise.inputs["Detail"].default_value = 3.0
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.interpolation = "CONSTANT"
    el = ramp.color_ramp.elements
    el[0].position = 0.0; el[0].color = (*lin(COR["ocean"]), 1)
    el[1].position = 0.55; el[1].color = (*lin(COR["green"]), 1)
    nt.links.new(noise.outputs["Fac"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], b.inputs["Base Color"])
    _set(b, "Roughness", 0.35); _set(b, "Coat Weight", 0.5)
    MATS["globo"] = m
    # sombra de contato (blob com alpha radial)
    m = bpy.data.materials.new("capi_sombra")
    nt, b = _bsdf(m)
    tc = nt.nodes.new("ShaderNodeTexCoord")
    gr = nt.nodes.new("ShaderNodeTexGradient"); gr.gradient_type = "SPHERICAL"
    pw = nt.nodes.new("ShaderNodeMath"); pw.operation = "POWER"; pw.inputs[1].default_value = 1.6
    mu = nt.nodes.new("ShaderNodeMath"); mu.operation = "MULTIPLY"; mu.inputs[1].default_value = 0.35
    nt.links.new(tc.outputs["Object"], gr.inputs["Vector"])
    nt.links.new(gr.outputs["Fac"], pw.inputs[0])
    nt.links.new(pw.outputs[0], mu.inputs[0])
    nt.links.new(mu.outputs[0], b.inputs["Alpha"])
    _set(b, "Base Color", (0.02, 0.012, 0.005, 1)); _set(b, "Roughness", 1.0); _set(b, "Specular IOR Level", 0.0)
    _blend(m)
    MATS["sombra"] = m

# ------------------------------------------------------------------ utilidades de cena
def new_coll(name, parent=None):
    c = bpy.data.collections.new(name)
    (parent or bpy.context.scene.collection).children.link(c)
    return c

def M(loc=(0, 0, 0), rot=None, scale=1.0):
    if isinstance(rot, Quaternion):
        q = rot
    elif rot is None:
        q = Quaternion()
    else:
        q = Euler(rot).to_quaternion()
    if not hasattr(scale, "__len__"):
        scale = (scale, scale, scale)
    return Matrix.LocRotScale(Vector(loc), q, Vector(scale))

def place(ob, Mx, parent=None):
    if parent is not None:
        ob.parent = parent
        ob.matrix_parent_inverse = Matrix()
        ob.matrix_basis = Mx
    else:
        ob.matrix_world = Mx
    return ob

def empty(name, coll, Mx=None, parent=None):
    ob = bpy.data.objects.new(name, None)
    ob.empty_display_size = 0.1
    coll.objects.link(ob)
    return place(ob, Mx or Matrix(), parent)

def mesh_obj(name, bm, material, coll, Mx=None, parent=None, smooth=True):
    if smooth:
        for f in bm.faces:
            f.smooth = True
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me); bm.free()
    me.materials.append(material)
    ob = bpy.data.objects.new(name, me)
    coll.objects.link(ob)
    return place(ob, Mx or Matrix(), parent)

def bm_sphere(seg=48, rings=24, p=None):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=rings, radius=1.0)
    if p:
        for v in bm.verts:
            x, y, z = v.co
            s = abs(x) ** p + abs(y) ** p + abs(z) ** p
            if s > 1e-9:
                v.co *= s ** (-1.0 / p)
    return bm

def sphere(name, material, coll, Mx, p=None, parent=None, seg=40, rings=20):
    return mesh_obj(name, bm_sphere(seg, rings, p), material, coll, Mx, parent)

def bm_lathe(profile, seg=48):
    """Revolve um perfil [(raio, z), ...] de baixo para cima em torno de Z."""
    bm = bmesh.new()
    rings = []
    for r, z in profile:
        if r < 1e-6:
            rings.append([bm.verts.new((0, 0, z))])
        else:
            rings.append([bm.verts.new((r * math.cos(2 * math.pi * i / seg), r * math.sin(2 * math.pi * i / seg), z))
                          for i in range(seg)])
    for a, b in zip(rings, rings[1:]):
        if len(a) == 1 and len(b) == 1:
            continue
        for i in range(seg):
            j = (i + 1) % seg
            if len(a) == 1:
                bm.faces.new((a[0], b[j], b[i]))
            elif len(b) == 1:
                bm.faces.new((a[i], a[j], b[0]))
            else:
                bm.faces.new((a[i], a[j], b[j], b[i]))
    return bm

def lathe(name, material, coll, profile, Mx=None, parent=None, seg=48):
    return mesh_obj(name, bm_lathe(profile, seg), material, coll, Mx, parent)

def bm_etorus(a, b, r, seg=64, segv=14, arc=1.0):
    """Toro com caminho elíptico (a, b) no plano XY e tubo de raio r. arc<1 gera um arco aberto."""
    bm = bmesh.new()
    closed = arc >= 1.0
    n = seg if closed else seg + 1
    rows = []
    for i in range(n):
        t = 2 * math.pi * arc * i / seg
        c = Vector((a * math.cos(t), b * math.sin(t), 0))
        tan = Vector((-a * math.sin(t), b * math.cos(t), 0)).normalized()
        nrm = Vector((tan.y, -tan.x, 0))
        rows.append([bm.verts.new(c + r * (math.cos(2 * math.pi * j / segv) * nrm
                                          + math.sin(2 * math.pi * j / segv) * Vector((0, 0, 1))))
                     for j in range(segv)])
    for i in range(seg if closed else n - 1):
        A, B = rows[i], rows[(i + 1) % n]
        for j in range(segv):
            k = (j + 1) % segv
            bm.faces.new((A[j], B[j], B[k], A[k]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    return bm

def etorus(name, material, coll, a, b, r, Mx=None, parent=None, arc=1.0):
    return mesh_obj(name, bm_etorus(a, b, r, arc=arc), material, coll, Mx, parent)

def tube(name, pts, radius, material, coll, parent=None, cyclic=False, caps=True):
    cu = bpy.data.curves.new(name, "CURVE")
    cu.dimensions = "3D"
    cu.bevel_depth = radius
    cu.bevel_resolution = 4
    cu.use_fill_caps = True
    sp = cu.splines.new("POLY")
    sp.points.add(len(pts) - 1)
    for pt, co in zip(sp.points, pts):
        pt.co = (co[0], co[1], co[2], 1.0)
    sp.use_smooth = True
    sp.use_cyclic_u = cyclic
    cu.materials.append(material)
    ob = bpy.data.objects.new(name, cu)
    coll.objects.link(ob)
    place(ob, Matrix(), parent)
    if caps and not cyclic:
        for k, end in enumerate((pts[0], pts[-1])):
            sphere(f"{name}_ponta{k}", material, coll, M(end, None, radius), parent=parent, seg=16, rings=8)
    return ob

def text(name, body, material, coll, loc, size, rot=(math.pi / 2, 0, 0), parent=None):
    cu = bpy.data.curves.new(name, "FONT")
    cu.body = body
    cu.size = size
    cu.extrude = size * 0.12
    cu.bevel_depth = size * 0.04
    cu.align_x = "CENTER"
    cu.align_y = "CENTER"
    cu.materials.append(material)
    ob = bpy.data.objects.new(name, cu)
    coll.objects.link(ob)
    return place(ob, M(loc, rot), parent)

# ------------------------------------------------------------------ projeção na superfície
def ray(targets, origin, direction):
    origin = Vector(origin)
    direction = Vector(direction).normalized()
    best = None
    for t in targets:
        mi = t.matrix_world.inverted()
        o = mi @ origin
        d = (mi.to_3x3() @ direction).normalized()
        ok, loc, nor, _ = t.ray_cast(o, d)
        if ok:
            wl = t.matrix_world @ loc
            wn = (t.matrix_world.to_3x3().inverted().transposed() @ nor).normalized()
            dist = (wl - origin).length
            if best is None or dist < best[2]:
                best = (wl, wn, dist)
    return (best[0], best[1]) if best else (None, None)

def front(targets, x, z):
    return ray(targets, (x, -5, z), (0, 1, 0))

def frame_at(p, n):
    """Matriz com -Y local apontando para fora da superfície (normal n)."""
    return Matrix.Translation(p) @ n.to_track_quat("-Y", "Z").to_matrix().to_4x4()

def qpts(p0, c, p1, n=16):
    out = []
    for i in range(n + 1):
        t = i / n
        out.append(((1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * c[0] + t * t * p1[0],
                    (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * c[1] + t * t * p1[1]))
    return out

def lpts(p0, p1, n=8):
    return [(p0[0] + (p1[0] - p0[0]) * i / n, p0[1] + (p1[1] - p0[1]) * i / n) for i in range(n + 1)]

def stroke(name, targets, svgpts, radius, material, coll, dz=0.0, lift=None):
    """Traço do SVG projetado na superfície (sobrancelhas, bocas, olhos fechados)."""
    lift = radius * 0.45 if lift is None else lift
    pts = []
    for sx, sy in svgpts:
        x, z = P(sx, sy, dz)
        p, n = front(targets, x, z)
        if p is not None:
            pts.append(p + n * lift)
    return tube(name, pts, radius, material, coll)

def decal(name, targets, svgpts, material, coll, lift=0.012, thick=0.02, cuts=3):
    """Forma preenchida do SVG projetada na superfície (boca aberta, língua)."""
    clean = []
    for pt in svgpts:
        if not clean or (abs(pt[0] - clean[-1][0]) + abs(pt[1] - clean[-1][1])) > 1e-4:
            clean.append(pt)
    if abs(clean[0][0] - clean[-1][0]) + abs(clean[0][1] - clean[-1][1]) < 1e-4:
        clean.pop()
    bm = bmesh.new()
    vs = [bm.verts.new((P(*pt)[0], 0, P(*pt)[1])) for pt in clean]
    edges = [bm.edges.new((vs[i], vs[(i + 1) % len(vs)])) for i in range(len(vs))]
    bmesh.ops.triangle_fill(bm, use_beauty=True, use_dissolve=False, edges=edges, normal=Vector((0, -1, 0)))
    bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=cuts, use_grid_fill=True)
    for v in bm.verts:
        p, n = front(targets, v.co.x, v.co.z)
        if p is not None:
            v.co = p + n * lift
    ob = mesh_obj(name, bm, material, coll)
    sol = ob.modifiers.new("espessura", "SOLIDIFY")
    sol.thickness = thick
    sol.offset = 0.0
    return ob

def head_ring(targets, z, n=96, cx=0.0, cy=-0.12):
    out = []
    for i in range(n):
        a = 2 * math.pi * i / n
        o = Vector((cx + 3 * math.cos(a), cy + 3 * math.sin(a), z))
        p, nr = ray(targets, o, Vector((cx, cy, z)) - o)
        if p is not None:
            out.append((a, p, nr))
    return out

def round_rect(w, h, r, n=6):
    pts = []
    for cx, cz, a0 in ((w / 2 - r, h / 2 - r, 0), (-w / 2 + r, h / 2 - r, 90), (-w / 2 + r, -h / 2 + r, 180), (w / 2 - r, -h / 2 + r, 270)):
        for i in range(n + 1):
            a = math.radians(a0 + 90 * i / n)
            pts.append((cx + r * math.cos(a), cz + r * math.sin(a)))
    return pts

# ------------------------------------------------------------------ reset
def reset():
    for ob in list(bpy.data.objects):
        bpy.data.objects.remove(ob, do_unlink=True)
    for c in list(bpy.data.collections):
        bpy.data.collections.remove(c)
    for coll in (bpy.data.meshes, bpy.data.curves, bpy.data.lights, bpy.data.cameras):
        for d in list(coll):
            if d.users == 0:
                coll.remove(d)
    for m in list(bpy.data.materials):
        if m.name.startswith("capi_") or m.users == 0:
            bpy.data.materials.remove(m)

# ------------------------------------------------------------------ corpo
OBJ = {}

def build_base(root):
    c = new_coll("Base", root)
    OBJ["corpo"] = sphere("Corpo", MATS["fur"], c, M(BODY_C, None, BODY_S), seg=64, rings=32)
    OBJ["barriga"] = sphere("Barriga", MATS["belly"], c, M((0, -0.45, 0.44), None, (0.46, 0.25, 0.38)))
    OBJ["cabeca"] = sphere("Cabeca", MATS["fur"], c, M(HEAD_C, None, HEAD_S), p=2.6, seg=72, rings=36)
    OBJ["focinho"] = sphere("Focinho", MATS["snout"], c, M((0, -0.66, 1.03), None, (0.46, 0.28, 0.28)), p=2.5, seg=64, rings=32)
    for s, side in ((-1, "E"), (1, "D")):
        sphere("Orelha" + side, MATS["ear"], c, M((0.5 * s, -0.02, 1.84), (0, 0, -0.35 * s), (0.15, 0.1, 0.12)))
        sphere("OrelhaIn" + side, MATS["ear_in"], c, M((0.5 * s, -0.1, 1.84), (0, 0, -0.35 * s), (0.08, 0.04, 0.065)))
        sphere("Pe" + side, MATS["foot"], c, M((0.32 * s, -0.46, 0.08), (0, 0, 0.15 * s), (0.2, 0.27, 0.1)))
    bpy.context.view_layer.update()
    H, S = [OBJ["cabeca"]], [OBJ["focinho"]]
    # narinas e bochechas
    for s, side in ((-1, "E"), (1, "D")):
        x, z = P(120 + 16 * s, 120)
        p, n = front(S, x, z)
        sphere("Narina" + side, MATS["ink"], c, frame_at(p, n) @ M((0, 0.005, 0), None, (0.06, 0.03, 0.045)))
        x, z = P(120 + 50 * s, 118)
        p, n = front(H, x, z)
        sphere("Bochecha" + side, MATS["blush"], c, frame_at(p, n) @ M((0, 0.01, 0), None, (0.11, 0.025, 0.065)))
    # braços com mãos (pivô no ombro, pose aplicada em set_state)
    for s, side in ((-1, "E"), (1, "D")):
        sh = empty("Ombro" + side, c, M((SHOULDER.x * s, SHOULDER.y, SHOULDER.z)))
        sh.rotation_mode = "QUATERNION"
        OBJ["ombro" + side] = sh
        OBJ["braco" + side] = sphere("Braco" + side, MATS["arm"], c, M((0, 0, -ARM_L / 2), None, (0.15, 0.15, ARM_L / 2 + 0.06)), parent=sh)
        sphere("Mao" + side, MATS["arm"], c, M((0, 0, -ARM_L), None, (0.14, 0.13, 0.14)), parent=sh)
        sphere("Polegar" + side, MATS["arm"], c, M((-0.07 * s, -0.1, -ARM_L + 0.05), None, (0.06, 0.055, 0.075)), parent=sh)
        OBJ["prop" + side] = empty("Segura" + side, c)
    return c

def eyes_open(coll, look=0.0):
    H = [OBJ["cabeca"]]
    for s, side in ((-1, "E"), (1, "D")):
        x, z = P(120 + 28 * s, 92, EYE_DZ)
        p, n = front(H, x, z)
        F = frame_at(p, n)
        sphere(f"Olho{side}_{coll.name}", MATS["eye"], coll, F @ M((0, 0.02, 0), None, (0.17, 0.1, 0.2)))
        sphere(f"Pupila{side}_{coll.name}", MATS["ink"], coll, F @ M((look, -0.045, -0.03), None, (0.11, 0.045, 0.13)))
        sphere(f"Brilho{side}_{coll.name}", MATS["shine"], coll, F @ M((look + 0.045, -0.092, 0.035), None, (0.045, 0.02, 0.045)), seg=16, rings=8)
        sphere(f"Brilho2{side}_{coll.name}", MATS["shine"], coll, F @ M((look - 0.04, -0.085, -0.08), None, (0.02, 0.012, 0.02)), seg=12, rings=6)

def open_mouth(coll, p0, c, p1, tongue_ctrl_dy=-6):
    S = [OBJ["focinho"]]
    bottom = qpts(p0, c, p1, 24)
    decal("Boca_" + coll.name, S, bottom, MATS["ink"], coll)
    # língua: faixa inferior da boca
    lo = [bottom[i] for i in range(6, 19)]
    ctrl = ((lo[0][0] + lo[-1][0]) / 2, p0[1] + tongue_ctrl_dy)
    top = qpts(lo[-1], ctrl, lo[0], 10)[1:-1]
    decal("Lingua_" + coll.name, S, lo + top, MATS["tongue"], coll, lift=0.024, thick=0.012, cuts=2)

def build_expressions(root):
    H, S = [OBJ["cabeca"]], [OBJ["focinho"]]
    ink = MATS["ink"]
    # neutra
    c = new_coll("Expr_neutra", root)
    eyes_open(c)
    stroke("Boca_neutra", S, qpts((108, 141), (120, 150), (132, 141)), 0.022, ink, c)
    # feliz
    c = new_coll("Expr_feliz", root)
    for s in (-1, 1):
        x0 = 120 + 28 * s
        stroke(f"OlhoFeliz{s}", H, qpts((x0 - 16, 96), (x0, 76), (x0 + 16, 96)), 0.035, ink, c, dz=EYE_DZ)
    open_mouth(c, (104, 138), (120, 158), (136, 138))
    # pensando
    c = new_coll("Expr_pensando", root)
    eyes_open(c, look=0.05)
    stroke("SobrE_pensando", H, lpts((76, 64), (106, 70)), 0.025, ink, c, dz=EYE_DZ + 0.05)
    stroke("SobrD_pensando", H, lpts((134, 70), (164, 64)), 0.025, ink, c, dz=EYE_DZ + 0.05)
    stroke("Boca_pensando", S, qpts((110, 146), (122, 146), (132, 139)), 0.022, ink, c)
    for i, (sx, sy, r) in enumerate(((204, 60, 5), (216, 42, 8), (226, 18, 12))):
        x, z = P(sx, sy)
        sphere(f"Nuvem{i}", MATS["bubble"], c, M((x, -0.4, z), None, r * PX * 1.3))
    # quase
    c = new_coll("Expr_quase", root)
    eyes_open(c)
    stroke("SobrE_quase", H, lpts((78, 66), (106, 68)), 0.025, ink, c, dz=EYE_DZ + 0.05)
    stroke("SobrD_quase", H, lpts((134, 68), (162, 62)), 0.025, ink, c, dz=EYE_DZ + 0.05)
    stroke("Boca_quase", S, qpts((106, 144), (113, 138), (120, 144)) + qpts((120, 144), (127, 150), (134, 144))[1:], 0.022, ink, c)
    # comemora
    c = new_coll("Expr_comemora", root)
    for s in (-1, 1):
        x0 = 120 + 28 * s
        stroke(f"OlhoComemora{s}", H, qpts((x0 - 18, 98), (x0, 70), (x0 + 18, 98)), 0.038, ink, c, dz=EYE_DZ)
    open_mouth(c, (100, 136), (120, 164), (140, 136))
    fx = [((30, 40), (14, 26), "yellow"), ((20, 76), (2, 72), "orange"), ((210, 40), (226, 26), "yellow"), ((222, 76), (240, 72), "teal"),
          ((60, 8), (54, -8), "teal"), ((180, 8), (186, -8), "orange")]
    for i, (a, b, col) in enumerate(fx):
        (x0, z0), (x1, z1) = P(*a), P(*b)
        tube(f"Brilho_fx{i}", [(x0, 0.2, z0), (x1, 0.2, z1)], 0.03, MATS[col], c)
    # dormindo
    c = new_coll("Expr_dormindo", root)
    for s in (-1, 1):
        x0 = 120 + 28 * s
        stroke(f"OlhoDorme{s}", H, qpts((x0 - 14, 94), (x0, 104), (x0 + 14, 94)), 0.03, ink, c, dz=EYE_DZ)
    x, z = P(120, 145)
    p, n = front(S, x, z)
    sphere("Boca_dormindo", ink, c, frame_at(p, n) @ M((0, 0.0, 0), None, (0.05, 0.03, 0.04)))
    text("Z1", "z", MATS["zz"], c, (0.82, -0.35, 1.98), 0.34)
    text("Z2", "z", MATS["zz"], c, (1.06, -0.35, 2.26), 0.22)

# ------------------------------------------------------------------ roupas
def roupa_bio(root):
    c = new_coll("Roupa_bio", root)
    H = [OBJ["cabeca"]]
    # jaleco: casca do corpo com decote em V
    bm = bm_sphere(64, 32)
    k = 1.05
    for v in bm.verts:
        v.co = Vector((v.co.x * BODY_S.x * k, v.co.y * BODY_S.y * k + BODY_C.y, v.co.z * BODY_S.z * k + BODY_C.z))
    dele = []
    for f in bm.faces:
        ce = f.calc_center_median()
        if ce.z < 0.1 or (ce.y < -0.05 and ce.z > 0.5 and abs(ce.x) < (ce.z - 0.5) * 1.1):
            dele.append(f)
    bmesh.ops.delete(bm, geom=dele, context="FACES")
    coat = mesh_obj("Jaleco", bm, MATS["coat"], c)
    sol = coat.modifiers.new("espessura", "SOLIDIFY"); sol.thickness = 0.025; sol.offset = 1.0
    bpy.context.view_layer.update()
    CT = [coat]
    for s in (-1, 1):
        pts = []
        for i in range(12):
            z = 0.52 + 0.45 * i / 11
            p, n = front(CT, (z - 0.5) * 1.1 * s + 0.02 * s, z)
            if p is not None:
                pts.append(p + n * 0.03)
        tube(f"Lapela{s}", pts, 0.05, MATS["coat_d"], c)
    for i, z in enumerate((0.42, 0.26)):
        p, n = front(CT, 0.0, z)
        sphere(f"Botao{i}", MATS["grey"], c, frame_at(p, n) @ M((0, -0.02, 0), None, (0.035, 0.02, 0.035)))
    p, n = front(CT, 0.34, 0.38)
    F = frame_at(p, n)
    sphere("Bolso", MATS["coat_d"], c, F @ M((0, -0.02, 0), None, (0.13, 0.025, 0.1)), p=6)
    tube("CanetaBolso", [(F @ Vector((-0.04, -0.03, 0.02))), (F @ Vector((-0.04, -0.03, 0.2)))], 0.022, MATS["blue"], c)
    # brotinho na cabeça
    p, n = ray(H, (0, -0.12, 5), (0, 0, -1))
    tube("Caule", [p - Vector((0, 0, 0.03)), p + Vector((0, 0, 0.16))], 0.02, MATS["green_d"], c)
    sphere("Folha1", MATS["green"], c, M(p + Vector((0.09, 0, 0.19)), (0, -0.55, 0), (0.12, 0.035, 0.055)))
    sphere("Folha2", MATS["green_l"], c, M(p + Vector((-0.08, 0, 0.16)), (0, 0.55, 0), (0.1, 0.035, 0.05)))
    # tubo de ensaio na mão
    g = empty("TuboGrupo", c, M((0.02, 0.05, -0.06), (0, 0.28, 0)), parent=OBJ["propD"])
    bottom = [(0.065 * math.sin(a), 0.065 * (1 - math.cos(a))) for a in (i * math.pi / 2 / 8 for i in range(9))]
    outer = [(r, z) for r, z in bottom] + [(0.065, 0.42), (0.085, 0.44), (0.08, 0.455), (0.058, 0.44)]
    inner = [(0.058, 0.42)] + [(r * 0.89, z + 0.008) for r, z in reversed(bottom)]
    lathe("Tubo", MATS["glass"], c, outer + inner, parent=g)
    liq = [(r * 0.84, z + 0.012) for r, z in bottom] + [(0.055, 0.24), (0, 0.24)]
    lathe("TuboLiquido", MATS["liquid"], c, liq, parent=g)
    for i, (x, z, r) in enumerate(((0.01, 0.12, 0.014), (-0.015, 0.18, 0.01), (0.012, 0.21, 0.008))):
        sphere(f"TuboBolha{i}", MATS["white"], c, M((x, -0.02, z), None, r), parent=g, seg=12, rings=6)
    return c

def roupa_qui(root):
    c = new_coll("Roupa_qui", root)
    H = [OBJ["cabeca"]]
    zg = 1.83
    ring = head_ring(H, zg)
    tube("Elastico", [p + n * 0.03 for a, p, n in ring], 0.035, MATS["dark"], c, cyclic=True)
    for s in (-1, 1):
        p, n = front(H, 0.27 * s, zg)
        F = frame_at(p, n)
        R = F @ Matrix.Rotation(math.pi / 2, 4, "X")
        mesh_obj(f"Aro{s}", bm_etorus(0.14, 0.14, 0.04), MATS["dark"], c, R @ M((0, 0, 0.07)))
        sphere(f"Lente{s}", MATS["lens"], c, F @ M((0, -0.07, 0), None, (0.14, 0.05, 0.14)))
        sphere(f"LenteBrilho{s}", MATS["shine"], c, F @ M((-0.05, -0.115, 0.05), (0, 0.6, 0), (0.035, 0.01, 0.015)), seg=12, rings=6)
    # béquer
    g = empty("BequerGrupo", c, M((0.03, 0.09, 0.0)), parent=OBJ["propD"])
    lathe("Bequer", MATS["glass"], c,
          [(0, -0.1), (0.13, -0.1), (0.155, -0.08), (0.155, 0.2), (0.178, 0.235), (0.168, 0.245), (0.142, 0.21), (0.142, -0.075), (0, -0.075)], parent=g)
    lathe("BequerLiquido", MATS["liquid"], c, [(0, -0.075), (0.138, -0.075), (0.138, 0.08), (0, 0.08)], parent=g)
    for i, z in enumerate((0.0, 0.07, 0.14)):
        tube(f"Marca{i}", [(-0.1, -0.16, z), (-0.05, -0.16, z)], 0.007, MATS["white"], c, parent=g)
    for i, (x, z, r) in enumerate(((0.0, 0.32, 0.04), (0.06, 0.42, 0.03), (-0.02, 0.5, 0.022))):
        sphere(f"BequerBolha{i}", MATS["bolha"], c, M((x, 0, z), None, r), parent=g, seg=16, rings=8)
    return c

def roupa_fis(root):
    c = new_coll("Roupa_fis", root)
    ctr = Vector((0, -0.2, 2.3))
    sphere("Nucleo", MATS["yellow"], c, M(ctr, None, 0.075))
    for i, k in enumerate((0, math.pi / 3, -math.pi / 3)):
        R = M(ctr, (math.pi / 2, k, 0))
        mesh_obj(f"Orbita{i}", bm_etorus(0.34, 0.12, 0.018), MATS["purple"], c, R)
        t = 0.8 + i * 2.1
        sphere(f"Eletron{i}", MATS["blue"], c, R @ M((0.34 * math.cos(t), 0.12 * math.sin(t), 0), None, 0.035), seg=16, rings=8)
    # maçã
    g = empty("MacaGrupo", c, M((0.02, 0.07, 0.06)), parent=OBJ["propD"])
    lathe("Maca", MATS["red"], c, [(0, 0.03), (0.06, 0.0), (0.13, 0.02), (0.18, 0.09), (0.195, 0.17), (0.18, 0.25), (0.13, 0.31), (0.07, 0.315), (0.03, 0.29), (0, 0.275)], parent=g)
    tube("Cabinho", [(0, 0, 0.27), (0.01, 0, 0.33), (0.04, 0, 0.38)], 0.018, MATS["stem"], c, parent=g)
    sphere("MacaFolha", MATS["green"], c, M((0.1, -0.01, 0.36), (0, -0.35, 0), (0.09, 0.02, 0.045)), parent=g)
    sphere("MacaBrilho", MATS["shine"], c, M((-0.08, -0.17, 0.2), (0, 0, 0.5), (0.03, 0.012, 0.045)), parent=g, seg=12, rings=6)
    return c

def roupa_mat(root):
    c = new_coll("Roupa_mat", root)
    H = [OBJ["cabeca"]]
    ends = {}
    for s in (-1, 1):
        x, z = P(120 + 28 * s, 92, EYE_DZ)
        p, n = front(H, x, z)
        F = frame_at(p, n)
        pts = [F @ Vector((u, -0.14, v)) for u, v in round_rect(0.42, 0.4, 0.08)]
        tube(f"Armacao{s}", pts, 0.024, MATS["dark"], c, cyclic=True)
        ends[s] = (F @ Vector((-0.21 * s, -0.14, 0.04)), F @ Vector((0.21 * s, -0.14, 0.06)))
        a = F @ Vector((0.21 * s, -0.14, 0.06))
        tube(f"Haste{s}", [a, a + Vector((0.04 * s, 0.32, 0.02))], 0.02, MATS["dark"], c)
    tube("Ponte", [ends[-1][0], (ends[-1][0] + ends[1][0]) / 2 + Vector((0, -0.02, 0.03)), ends[1][0]], 0.022, MATS["dark"], c)
    # calculadora
    g = empty("CalcGrupo", c, M((0.05, 0.07, 0.19), (-0.12, 0, -0.12)), parent=OBJ["propD"])
    sphere("Calculadora", MATS["coral"], c, M((0, 0, 0), None, (0.19, 0.045, 0.25)), p=7, parent=g, seg=48, rings=24)
    sphere("Visor", MATS["screen"], c, M((0, -0.04, 0.14), None, (0.15, 0.015, 0.065)), p=8, parent=g)
    text("Pi", "π", MATS["teal_d"], c, (-0.07, -0.058, 0.14), 0.1, parent=g)
    cols = ["white", "white", "yellow"]
    for r, z in enumerate((0.02, -0.06, -0.14)):
        for k, x in enumerate((-0.1, 0.0, 0.1)):
            sphere(f"Tecla{r}{k}", MATS[cols[k] if r < 2 else "white"], c, M((x, -0.045, z), None, (0.04, 0.015, 0.028)), p=6, parent=g, seg=24, rings=12)
    return c

def roupa_his(root):
    c = new_coll("Roupa_his", root)
    H = [OBJ["cabeca"]]
    ring = head_ring(H, 1.74, n=72)
    up = Vector((0, 0, 1))
    for s in (-1, 1):
        # de trás até a testa, deixando uma folga na frente; folhas apontam para a frente
        side = [(a, p, n) for a, p, n in ring if math.cos(a) * s > 0.08]
        side.sort(key=lambda it: -it[1].y)
        tube(f"Ramo{s}", [p + n * 0.02 for a, p, n in side], 0.018, MATS["green_d"], c)
        for i in range(0, len(side) - 1, 3):
            a, p, n = side[i]
            t = (side[i + 1][1] - p).normalized()
            for k, ang in enumerate((0.55, -0.4)):
                X = (t * math.cos(ang) + up * math.sin(ang)).normalized()
                Y = (n - n.dot(X) * X).normalized()
                Z = X.cross(Y)
                R = Matrix((X, Y, Z)).transposed().to_4x4()
                loc = p + n * 0.035 + X * 0.1
                sphere(f"Louro{s}_{i}_{k}", MATS["green"] if k == 0 else MATS["green_l"], c,
                       Matrix.Translation(loc) @ R @ M((0, 0, 0), None, (0.12, 0.022, 0.052)), seg=16, rings=8)
    # pergaminho
    g = empty("PergGrupo", c, M((0.04, 0.07, 0.2), (-0.1, 0, 0.12)), parent=OBJ["propD"])
    sphere("Folha", MATS["cream"], c, M((0, 0, 0), None, (0.16, 0.012, 0.2)), p=8, parent=g)
    for i, z in enumerate((0.21, -0.21)):
        lathe(f"Rolo{i}", MATS["roll"], c, [(0, -0.2), (0.04, -0.2), (0.046, -0.19), (0.046, 0.19), (0.04, 0.2), (0, 0.2)],
              M((0, 0, z), (0, math.pi / 2, 0)), parent=g, seg=32)
        for s in (-1, 1):
            sphere(f"Pomo{i}{s}", MATS["brown"], c, M((0.215 * s, 0, z), None, 0.032), parent=g, seg=16, rings=8)
    for i, (z, w) in enumerate(((0.11, 0.1), (0.05, 0.08), (-0.01, 0.1), (-0.07, 0.06))):
        tube(f"Linha{i}", [(-w, -0.016, z), (w, -0.016, z)], 0.008, MATS["brown"], c, parent=g)
    sphere("Selo", MATS["wax"], c, M((0.08, -0.02, -0.13), None, (0.045, 0.015, 0.045)), parent=g, seg=24, rings=12)
    return c

def roupa_geo(root):
    c = new_coll("Roupa_geo", root)
    H = [OBJ["cabeca"]]
    p, n = ray(H, (0, -0.12, 5), (0, 0, -1))
    hat = M((0, -0.1, 1.72), (-0.12, 0, 0), (1.0, 0.92, 1.0))
    prof = [(0, 0.02), (0.5, 0.02), (0.84, -0.03), (0.9, -0.01), (0.88, 0.025), (0.6, 0.06), (0.585, 0.1), (0.57, 0.2),
            (0.52, 0.3), (0.42, 0.38), (0.26, 0.43), (0, 0.45)]
    lathe("Capacete", MATS["khaki"], c, prof, hat, seg=64)
    mesh_obj("Fita", bm_etorus(0.595, 0.595, 0.04), MATS["band"], c, hat @ M((0, 0, 0.11)))
    sphere("Botao", MATS["khaki_d"], c, hat @ M((0, 0, 0.45), None, (0.06, 0.06, 0.035)))
    # globo
    g = empty("GloboGrupo", c, M((0.03, 0.06, -0.02)), parent=OBJ["propD"])
    lathe("Base", MATS["dark"], c, [(0, -0.12), (0.14, -0.12), (0.15, -0.1), (0.13, -0.08), (0.035, -0.06), (0.03, 0.05), (0, 0.06)], parent=g)
    ctr = Vector((0, 0, 0.3))
    sphere("Globo", MATS["globo"], c, M(ctr, (0, 0.4, 0), 0.2), parent=g, seg=48, rings=24)
    mesh_obj("Meridiano", bm_etorus(0.24, 0.24, 0.016, arc=0.5), MATS["grey"], c, M(ctr, (math.pi / 2, math.pi / 2 + 0.4, 0)), parent=g)
    b = ctr + Vector((math.sin(0.4) * -0.24, 0, math.cos(0.4) * -0.24))
    tube("Haste", [(0, 0, 0.0), tuple(b)], 0.022, MATS["grey"], c, parent=g)
    sphere("GloboBrilho", MATS["shine"], c, M((-0.08, -0.18, 0.38), (0, 0, 0.4), (0.035, 0.01, 0.05)), parent=g, seg=12, rings=6)
    return c

def roupa_por(root):
    c = new_coll("Roupa_por", root)
    b = M((0.06, -0.1, 1.8), (0.05, 0.2, 0), (1.0, 0.9, 1.0))
    lathe("Boina", MATS["pink"], c, [(0, 0.0), (0.5, 0.0), (0.58, 0.03), (0.68, 0.1), (0.7, 0.14), (0.63, 0.2), (0.42, 0.25), (0, 0.26)], b, seg=64)
    mesh_obj("BoinaFaixa", bm_etorus(0.52, 0.52, 0.04), MATS["pink_d"], c, b @ M((0, 0, 0.02)))
    sphere("BoinaPino", MATS["pink"], c, b @ M((0, 0, 0.28), None, (0.05, 0.05, 0.05)))
    # livro aberto
    g = empty("LivroGrupo", c, M((0.05, 0.07, 0.2), (-0.25, 0, -0.08)), parent=OBJ["propD"])
    for s in (-1, 1):
        R = M((0, 0, 0), (0, 0, -0.35 * s))
        sphere(f"Capa{s}", MATS["teal"], c, R @ M((0.13 * s, 0.03, 0), None, (0.135, 0.014, 0.175)), p=8, parent=g)
        sphere(f"Paginas{s}", MATS["white"], c, R @ M((0.12 * s, 0.0, 0), None, (0.12, 0.022, 0.16)), p=8, parent=g)
        for i, z in enumerate((0.09, 0.04, -0.01, -0.06, -0.11)):
            w = 0.07 if i != 4 else 0.04
            tube(f"Texto{s}{i}", [tuple(R @ Vector((0.12 * s - w, -0.026, z))), tuple(R @ Vector((0.12 * s + w, -0.026, z)))], 0.006, MATS["page_line"], c, parent=g)
    lathe("Lombada", MATS["teal_d"], c, [(0, -0.17), (0.03, -0.17), (0.03, 0.17), (0, 0.17)], M((0, 0.035, 0)), parent=g, seg=24)
    return c

def roupa_red(root):
    c = new_coll("Roupa_red", root)
    s = M((0, -0.08, 0.82), (0.16, 0, 0))
    mesh_obj("Cachecol", bm_etorus(0.66, 0.56, 0.1), MATS["yellow"], c, s)
    mesh_obj("CachecolListra", bm_etorus(0.66, 0.56, 0.1015, seg=64), MATS["gold"], c, s @ M((0, 0, 0), None, (1, 1, 0.25)))
    ponta = M((0.3, -0.64, 0.56), (0.1, 0, 0.12))
    sphere("CachecolPonta", MATS["yellow"], c, ponta @ M((0, 0, 0), None, (0.11, 0.055, 0.26)), p=4)
    for i, z in enumerate((0.06, -0.08)):
        sphere(f"PontaListra{i}", MATS["gold"], c, ponta @ M((0, 0, z), None, (0.113, 0.058, 0.025)), p=4)
    for i, x in enumerate((-0.07, -0.025, 0.02, 0.065)):
        tube(f"Franja{i}", [tuple(ponta @ Vector((x, 0, -0.25))), tuple(ponta @ Vector((x, 0, -0.33)))], 0.014, MATS["gold"], c)
    # folha pautada (mão direita)
    g = empty("FolhaGrupo", c, M((0.05, 0.07, 0.2), (-0.1, 0, -0.1)), parent=OBJ["propD"])
    sphere("Papel", MATS["white"], c, M((0, 0, 0), None, (0.19, 0.008, 0.25)), p=10, parent=g, seg=48, rings=24)
    for i, z in enumerate((0.13, 0.07, 0.01, -0.05, -0.11, -0.17)):
        tube(f"Pauta{i}", [(-0.12, -0.011, z), (0.15, -0.011, z)], 0.005, MATS["paper_line"], c, parent=g, caps=False)
    tube("Margem", [(-0.13, -0.012, 0.23), (-0.13, -0.012, -0.23)], 0.005, MATS["coral"], c, parent=g, caps=False)
    # caneta (mão esquerda)
    g = empty("CanetaGrupo", c, M((0.0, -0.03, 0.08), (0.15, -0.18, 0)), parent=OBJ["propE"])
    lathe("Caneta", MATS["dark"], c, [(0, -0.14), (0.032, -0.14), (0.034, 0.2), (0.03, 0.225), (0, 0.23)], parent=g, seg=32)
    lathe("Ponta", MATS["yellow"], c, [(0, -0.22), (0.008, -0.212), (0.032, -0.14), (0, -0.14)], parent=g, seg=32)
    sphere("Clipe", MATS["yellow"], c, M((0, -0.036, 0.13), None, (0.01, 0.01, 0.08)), parent=g, seg=12, rings=8)
    return c

# ------------------------------------------------------------------ cena: luz, câmera, render
def build_scene(root):
    c = new_coll("Cena", root)
    sc = bpy.context.scene
    # sombra de contato
    bm = bmesh.new()
    vs = [bm.verts.new(v) for v in ((-1, -1, 0), (1, -1, 0), (1, 1, 0), (-1, 1, 0))]
    bm.faces.new(vs)
    sh = mesh_obj("Sombra", bm, MATS["sombra"], c, M((0, -0.1, 0.002), None, (1.05, 0.62, 1)), smooth=False)
    try:
        sh.visible_shadow = False
    except Exception:
        pass
    # luzes
    def light(name, loc, energy, size, color=(1, 1, 1), target=(0, -0.2, 1.1)):
        ld = bpy.data.lights.new(name, "AREA")
        ld.energy = energy; ld.size = size; ld.color = color
        ob = bpy.data.objects.new(name, ld); c.objects.link(ob)
        d = Vector(target) - Vector(loc)
        ob.matrix_world = Matrix.LocRotScale(Vector(loc), d.to_track_quat("-Z", "Y"), Vector((1, 1, 1)))
        return ob
    light("Principal", (-3.2, -4.2, 4.2), 650, 4.0, (1.0, 0.97, 0.92))
    light("Preenchimento", (4.2, -3.5, 1.8), 220, 5.0, (0.92, 0.96, 1.0))
    light("Contorno", (2.5, 4.0, 3.5), 1100, 3.0, (1.0, 0.95, 0.88))
    # mundo (luz ambiente suave; fundo sai transparente)
    w = sc.world or bpy.data.worlds.new("World")
    sc.world = w
    try:
        w.use_nodes = True
    except Exception:
        pass
    bg = next((n for n in w.node_tree.nodes if n.type == "BACKGROUND"), None)
    if bg:
        bg.inputs[0].default_value = (1.0, 0.98, 0.95, 1)
        bg.inputs[1].default_value = 0.35
    # câmera levemente em 3/4
    cd = bpy.data.cameras.new("CapiCam"); cd.lens = 88
    cam = bpy.data.objects.new("CapiCam", cd); c.objects.link(cam)
    target = Vector((0.1, 0, 1.22))
    loc = Vector((1.6, -7.4, 2.25))
    cam.matrix_world = Matrix.LocRotScale(loc, (target - loc).to_track_quat("-Z", "Y"), Vector((1, 1, 1)))
    sc.camera = cam
    # render
    r = sc.render
    for eng in ("BLENDER_EEVEE", "BLENDER_EEVEE_NEXT"):
        try:
            r.engine = eng
            break
        except TypeError:
            continue
    r.resolution_x = r.resolution_y = 1024
    r.resolution_percentage = 100
    r.film_transparent = True
    try:
        sc.eevee.taa_render_samples = 32
    except Exception:
        pass
    fmts = [i.identifier for i in r.image_settings.bl_rna.properties["file_format"].enum_items]
    if "PNG" in fmts:
        r.image_settings.file_format = "PNG"
    try:
        r.image_settings.color_mode = "RGBA"
    except Exception:
        pass
    vts = [i.identifier for i in sc.view_settings.bl_rna.properties["view_transform"].enum_items]
    if "Standard" in vts:
        sc.view_settings.view_transform = "Standard"
    try:
        sc.view_settings.look = "None"
    except Exception:
        pass

# ------------------------------------------------------------------ API
def build():
    reset()
    build_materials()
    root = new_coll("Capi")
    build_base(root)
    build_expressions(root)
    for f in (roupa_bio, roupa_qui, roupa_fis, roupa_mat, roupa_his, roupa_geo, roupa_por, roupa_red):
        f(root)
    build_scene(root)
    set_state("neutra", "nenhuma")
    return sorted(c.name for c in bpy.data.collections)

POSES = {
    "descanso": Vector((-0.08, -0.46, -0.44)),
    "segura": Vector((0.35, -0.85, -0.25)),
    "comemora": Vector((0.62, -0.20, 0.76)),
}

def _pose(side, pose):
    s = 1 if side == "D" else -1
    d = POSES[pose].copy()
    d.x *= s
    d.normalize()
    sh = OBJ["ombro" + side]
    sh.rotation_quaternion = d.to_track_quat("-Z", "Y")
    base = Vector((SHOULDER.x * s, SHOULDER.y, SHOULDER.z))
    OBJ["prop" + side].matrix_world = M(base + d * ARM_L, None, PROP_SCALE)

def _ensure_obj():
    if OBJ.get("cabeca") and OBJ["cabeca"].name in bpy.data.objects:
        return
    ob = bpy.data.objects
    OBJ.update(cabeca=ob["Cabeca"], focinho=ob["Focinho"], barriga=ob["Barriga"],
               ombroE=ob["OmbroE"], ombroD=ob["OmbroD"], bracoE=ob["BracoE"], bracoD=ob["BracoD"],
               propE=ob["SeguraE"], propD=ob["SeguraD"])
    for k in COR:
        MATS[k] = bpy.data.materials["capi_" + k]

def set_state(expr="neutra", roupa="nenhuma"):
    _ensure_obj()
    for c in bpy.data.collections:
        if c.name.startswith("Expr_"):
            show = c.name == "Expr_" + expr
        elif c.name.startswith("Roupa_"):
            show = c.name == "Roupa_" + roupa
        else:
            continue
        c.hide_render = not show
        c.hide_viewport = not show
    up = expr == "comemora"
    _pose("D", "comemora" if up else ("segura" if roupa != "nenhuma" else "descanso"))
    _pose("E", "comemora" if up else ("segura" if roupa == "red" else "descanso"))
    OBJ["barriga"].hide_render = OBJ["barriga"].hide_viewport = roupa == "bio"
    manga = MATS["coat"] if roupa == "bio" else MATS["arm"]
    for side in ("E", "D"):
        OBJ["braco" + side].data.materials[0] = manga
    bpy.context.view_layer.update()

def render(path):
    bpy.context.scene.render.filepath = path
    bpy.ops.render.render(write_still=True)
    return path

def render_batch(outdir, roupas=None, exprs=None):
    os.makedirs(outdir, exist_ok=True)
    done = []
    for r in roupas or ROUPAS:
        for e in exprs or EXPRS:
            set_state(e, r)
            done.append(render(os.path.join(outdir, f"capi_{r}_{e}.png")))
    return done
