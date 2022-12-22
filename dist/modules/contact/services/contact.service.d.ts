import { MailerService } from 'src/modules/mailer/services/mailer.service';
import { ContactPayload } from '../payloads';
export declare class ContactService {
    private readonly mailService;
    constructor(mailService: MailerService);
    contact(data: ContactPayload): Promise<boolean>;
}
