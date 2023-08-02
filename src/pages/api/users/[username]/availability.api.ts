import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import dayjs from 'dayjs'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const username = String(req.query.username)
  const { date } = req.query

  if (!date) {
    return res.status(400).json({ message: 'Date not provided' })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User does not exist' })
  }

  const referenceDate = dayjs(String(date))
  const isPastDate = referenceDate.endOf('day').isBefore(new Date())

  if (isPastDate) {
    return res.json({ possibleTimes: [], availableTimes: [] })
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day'),
    },
  })

  if (!userAvailability) {
    return res.json({ possibleTimes: [], availableTimes: [] })
  }

  const { time_end_in_minutes, time_start_in_minutes } = userAvailability

  const startHour = time_start_in_minutes / 60 // Essa divisão por 60 só pode ser feita pois a pessoa só pode colocar sua disponibilidade de hora em hora, caso fosse possível selecionar outros intervalos essa divisão poderia dar numeros quebrados e quebrar o código
  const endHour = time_end_in_minutes / 60

  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, i) => {
      return startHour + i
    },
  )
  //-------CONSTANTE blockedTimes ANTERIOR-----------------
  // const blockedTimes = await prisma.scheduling.findMany({
  //   where: {
  //     user_id: user.id,
  //     date: {
  //       gte: referenceDate.set('hour', startHour).toDate(), // gte -> grather than or equal
  //       lte: referenceDate.set('hour', endHour).toDate(),
  //     },
  //   },
  // })

  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.startOf('day').toDate(),
        lte: referenceDate.endOf('day').toDate(),
      },
    },
  })
  //---------CONSTANTE availableTimes ANTERIOR------------------
  // const availableTimes = possibleTimes.filter((time) => {
  //   const isTimeBlocked = blockedTimes.some(
  //     (blockedTime) => blockedTime.date.getHours() === time,
  //   )

  //   const isTimeInPast = referenceDate.set('hour', time).isBefore(new Date())

  //   return !isTimeBlocked && !isTimeInPast
  // })

  const availableTimes  = blockedTimes.map((schedules) => {
    return schedules.date
  })

  return res.json({ possibleTimes, availableTimes })
}
