"use client";

import { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import API from "@/lib/api";

const blank = { title: "", subtitle: "", image: "", href: "/shop-with-sidebar" };

function Cards({ title, items, onAdd, onEdit, onDelete }) {
  return <Paper sx={{ p: 2, mt: 3 }}><Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}><Typography variant="h6">{title}</Typography><Button onClick={onAdd}>Add</Button></Box><Table size="small"><TableHead><TableRow><TableCell>Preview</TableCell><TableCell>Title</TableCell><TableCell>Link</TableCell><TableCell /></TableRow></TableHead><TableBody>{items.map((item, index) => <TableRow key={item._id || index}><TableCell>{item.image && <img src={item.image} alt="" width="70" height="42" style={{ objectFit: "cover" }} />}</TableCell><TableCell>{item.title}</TableCell><TableCell>{item.href}</TableCell><TableCell><IconButton onClick={() => onEdit(index)}><Edit /></IconButton><IconButton color="error" onClick={() => onDelete(index)}><Delete /></IconButton></TableCell></TableRow>)}</TableBody></Table></Paper>;
}

export default function HomepagePage() {
  const [content, setContent] = useState({ heroSlides: [], promoCards: [], testimonials: [], countdown: {} });
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  useEffect(() => { API.get("/home-content").then(({ data }) => setContent(data)).catch(console.error); }, []);
  const save = async () => { const next = { ...content, [editing.type]: editing.index === null ? [...content[editing.type], form] : content[editing.type].map((x, i) => i === editing.index ? form : x) }; await API.put("/home-content", next); setContent(next); setEditing(null); };
  const remove = async (type, index) => { const next = { ...content, [type]: content[type].filter((_, i) => i !== index) }; await API.put("/home-content", next); setContent(next); };
  const open = (type, index = null) => { setForm(index === null ? blank : content[type][index]); setEditing({ type, index }); };
  return <Box sx={{ p: 3 }}><Typography variant="h4">Homepage content</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>Manage banners and the sections after New Arrivals. Use hosted image URLs (Cloudinary) for now.</Typography><Cards title="Main banners / hero carousel" items={content.heroSlides} onAdd={() => open("heroSlides")} onEdit={(i) => open("heroSlides", i)} onDelete={(i) => remove("heroSlides", i)} /><Cards title="Promo cards after New Arrivals" items={content.promoCards} onAdd={() => open("promoCards")} onEdit={(i) => open("promoCards", i)} onDelete={(i) => remove("promoCards", i)} /><Dialog open={Boolean(editing)} onClose={() => setEditing(null)} fullWidth maxWidth="sm"><DialogTitle>{editing?.index === null ? "Add" : "Edit"} content card</DialogTitle><DialogContent sx={{ display: "grid", gap: 2, pt: "20px !important" }}>{[["title", "Title"], ["subtitle", "Subtitle"], ["image", "Image URL"], ["href", "Link path"]].map(([key, label]) => <TextField key={key} label={label} value={form[key] || ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })} fullWidth />)}</DialogContent><DialogActions><Button onClick={() => setEditing(null)}>Cancel</Button><Button variant="contained" onClick={save}>Save</Button></DialogActions></Dialog></Box>;
}
