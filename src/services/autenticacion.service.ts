import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {Llaves} from '../config/llaves';
import {Persona} from '../models/persona.model';
import {PersonaRepository} from '../repositories';

const jwt = require('jsonwebtoken');

@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(/* Add @inject to inject parameters */
    @repository(PersonaRepository)
    public personaRepository: PersonaRepository
  ) { }
  /*
   * Add service methods here
   */
  GenerarClave() {
    let clave = generador(8, false);
    return clave;
  }

  CifrarContrasena(clave: string) {
    let claveCifrada = cryptoJS.MD5(clave).toString();
    return claveCifrada;
  }

  IdentificarPersona(usuario: string, clave: string) {
    try {
      let p = this.personaRepository.findOne({where: {correo: usuario, clave: clave}})
      if (p) {
        return p;
      }
      return false;
    }
    catch {
      return false;
    }
  }

  GenerarTokenJWT(persona: Persona) {
    let token = jwt.sign(
      data: {
      id: persona.id,
      correo: persona.correo,
      nombre: persona.nombres
    },
      Llaves.claveJWT);
    return token;
  }

  ValidarTokenJWT(token: string) {
    try {
      let datos = jwt.verify(token, Llaves.claveJWT);
      return datos;
    } catch {
      return false;
    }
  }
}
