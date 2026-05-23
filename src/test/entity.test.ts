import { Entity } from "../entities/Entity";
import { Faction } from "../factions/Faction";

export function testEntity() {
    console.log("Testing Entity: ");

    const faction = new Faction("red", 0x00FF00, 100);
    const entity = new Entity();

    let errors = 0;

    if (entity.hp !== 0) {
        console.error(`Expected initial Hp to be 0, got ${entity.hp}`);
        errors++;
    }
    if (entity.maxHp !== 0) {
        console.error(`Expected initial MaxHp to bm 0, got ${entity.maxHp}`);
        errors++;
    }

    if (entity.attack !== 0) {
        console.error(`Expected initial Attack to be 0, got ${entity.attack}`);
        errors++;
    }
    if (entity.defense !== 0) {
        console.error(`Expected initial Defense to be 0, got ${entity.defense}`);
        errors++;
    }
    if (entity.movepoints !== 0) {
        console.error(`Expected initial MovePoints to be 0, got ${entity.movepoints}`);
        errors++;
    }
    if (entity.faction !== null) {
        console.error(`Expected initial faction to be null`);
        errors++;
    }

    entity.setMaxHp(100);
    entity.setHp(50);
    entity.setAttack(20);
    entity.setDefense(15);
    entity.setMovePoints(5);
    entity.faction = faction;

    if (entity.maxHp !== 100) {
        console.error(`Expected MaxHp to be 100, got ${entity.MaxHp}`);
        errors++;
    }
    if (entity.hp !== 50) {
        console.error(`Expected Hp to be 50, got ${entity.Hp}`);
        errors++;
    }
    if (entity.attack !== 20) {
        console.error(`Expected Attack to be 20, got ${entity.Attack}`);
        errors++;
    }
    if (entity.defense !== 15) {
        console.error(`Expected Defense to be 15, got ${entity.Defense}`);
        errors++;
    }
    if (entity.MovePoints !== 5) {
        console.error(`Expected MovePoints to be 5, got ${entity.MovePoints}`);
        errors++;
    }
    if (entity.faction !== faction) {
        console.error(`Expected faction to be assigned correctly`);
        errors++;
    }

    entity.setHp(150);
    if (entity.Hp !== 100) {
        console.error(`Hp should not exceed MaxHp. Got ${entity.Hp}`);
        errors++;
    }

    entity.setHp(-10);
    if (entity.Hp !== 0) {
        console.error(`Hp should not go below 0. Got ${entity.Hp}`);
        errors++;
    }

    entity.setHp(40);
    entity.setMaxHp(100);
    entity.increaseHP(30);
    if (entity.Hp !== 70) {
        console.error(`Expected Hp to be 70 after increase, got ${entity.Hp}`);
        errors++;
    }

    entity.increaseHP(50);
    if (entity.Hp !== 100) {
        console.error(`Hp should be capped at MaxHp. Got ${entity.Hp}`);
        errors++;
    }

    entity.decreaseHP(60);
    if (entity.Hp !== 40) {
        console.error(`Expected Hp to be 40 after decrease, got ${entity.Hp}`);
        errors++;
    }

    entity.decreaseHP(50);
    if (entity.Hp !== 0) {
        console.error(`Hp should not go below 0. Got ${entity.Hp}`);
        errors++;
    }

    if (!errors) {
        console.log("Testing ended successfully");
    } else {
        console.log(`Testing ended with ${errors} errors`);
    }
}