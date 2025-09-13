import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'db.json');

function readDb() {
  try {
    const fileData = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    return { doctors: [], pharmacy: [], prescriptions: [], appointments: [], hospitals: [] };
  }
}

function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export default function handler(req, res) {
  const db = readDb();

  if (req.method === 'GET') {
    const { patientName } = req.query;
    if (patientName) {
      const patientAppointments = db.appointments.filter(a => a.patientName === patientName);
      res.status(200).json(patientAppointments);
    } else {
      res.status(200).json(db.appointments);
    }
  } else if (req.method === 'POST') {
    const newAppointment = {
      id: Date.now(),
      ...req.body,
    };
    db.appointments.push(newAppointment);
    writeDb(db);
    res.status(201).json(newAppointment);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
