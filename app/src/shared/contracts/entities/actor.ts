import { ActorInstance } from '@/shared/entities/actor'


export class Actor {
  constructor(private readonly actor: ActorInstance) { }

  get id() {
    return this.actor.id
  }

  get name(): string {
    return this.actor.name
  }

  set name(name: string) {
    this.actor.name = name
  }

  public getObject() {
    return this.actor
  }
}
