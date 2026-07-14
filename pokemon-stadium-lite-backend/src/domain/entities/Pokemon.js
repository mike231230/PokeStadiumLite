class Pokemon {
  constructor({ id, name, type, hp, attack, defense, speed, sprite }) {
    this.id = id;
    this.name = name;
    this.type = type; 
    this.attack = attack;
    this.defense = defense;
    this.speed = speed;
    this.sprite = sprite;
    
    // Estado de la batalla
    this.maxHp = hp; 
    this.currentHp = hp; 
    this.isDefeated = false; 
  }

  /**
   * Calcula y aplica el daño recibido por un ataque.
   * @param {number} attackerAttack - La estadística de Ataque del Pokémon atacante.
   * @returns {number} El daño final infligido.
   */
  receiveAttack(attackerAttack) {
    if (this.isDefeated) return 0;

    // Fórmula: Damage = Attacker Attack - Defender Defense
    let damage = attackerAttack - this.defense;

    // Si el resultado es menor a 1, el daño debe ser 1 
    if (damage < 1) {
      damage = 1;
    }
    this.currentHp -= damage;

    // El HP nunca debe ser menor a 0
    if (this.currentHp <= 0) {
      this.currentHp = 0;
      // Si el HP del Pokémon defensor llega a 0, se considera derrotado
      this.isDefeated = true;
    }

    return damage; 
  }
}

module.exports = Pokemon;