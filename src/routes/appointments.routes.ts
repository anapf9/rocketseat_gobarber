import { Router, request } from 'express'
import { parseISO } from 'date-fns'
import { getCustomRepository } from 'typeorm'

import AppointmentsRepository from '../repositories/AppointmentsRepository'
import CreateAppointmentService from '../services/CreateApointmentService'
import ensureAuthenticated from './../middlewares/ensureAuthenticated'

const appointmentsRouter = Router()
// da forma seguinte usamos o middleware em todas as rotas que criarmos
appointmentsRouter.use(ensureAuthenticated)

appointmentsRouter.get('/', async (req, res) => {
  console.log(req.user)
  const appointmentsRepository = getCustomRepository(AppointmentsRepository)
  const appointments = await appointmentsRepository.find()

  return res.json(appointments)
})

appointmentsRouter.post('/', async (req, res) => {
  try {
    const { provider_id, date } = req.body

    // const parsedDate = startOfHour(parseISO(date))
    const parsedDate = parseISO(date)

    const createAppointmentService = new CreateAppointmentService()

    const appointment = await createAppointmentService.execute({ date: parsedDate, provider_id })

    return res.json(appointment)
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
})

export default appointmentsRouter
