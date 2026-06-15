// server/src/routes/skills.js
import { Hono } from 'hono'
import { SKILLS } from '../skills/index.js'

const skills = new Hono()

skills.get('/', (c) => {
  return c.json(SKILLS.map(({ id, name, icon }) => ({ id, name, icon })))
})

skills.get('/:id', (c) => {
  const skill = SKILLS.find(s => s.id === c.req.param('id'))
  if (!skill) return c.json({ error: 'Skill not found' }, 404)
  return c.json(skill)
})

export default skills