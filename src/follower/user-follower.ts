import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    UpdateEvent,
} from "typeorm";
import bcrypt from "bcrypt";

import { bcryptConfig } from "../config/bcrypt-config";
import { User } from "../models/user-model";

@EventSubscriber()
export class UserFollower implements EntitySubscriberInterface<User> {
    listenTo() {
        return User;
    }

    async beforeInsert(event: InsertEvent<User>) {
        event.entity.password = await bcrypt.hash(
            event.entity.password,
            bcryptConfig.saltRounds
        );
    }
}
