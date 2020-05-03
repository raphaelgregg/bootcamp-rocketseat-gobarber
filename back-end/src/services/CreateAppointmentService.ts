import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

import AppError from '../errors/AppErros';

/**
 * [x] Recebimentos de informações
 * [x] Tratativa de erro/excessões
 * [x] Acesso ao Repositório
 */

interface RequestDTO {
  provider_id: string;
  date: Date;
}

/**
 * (SOLID)
 * Single Responsability Principle
 * Dependency Inversion Principle
 */

class CreateAppointmentService {
  public async execute({
    provider_id,
    date,
  }: RequestDTO): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentsRepository.findbyDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
