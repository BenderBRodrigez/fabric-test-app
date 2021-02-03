import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HlfService } from '../shared/services/hlf.service';

@Injectable()
export class HlfAdminService {
  constructor(
    private readonly config: ConfigService,
    private readonly hlfService: HlfService,
  ) {
  }

  async getIdentity(id: string) {
    const identity = await this.hlfService.wallet.get(id);
    if (identity) {
      console.log(`An identity for the user ${id} already exists in the wallet`);
    }
    return identity;
  }

  async putIdentity(enrollmentID: string, enrollmentSecret: string, mspId: string) {
    const enrollment = await this.hlfService.caClient.enroll({ enrollmentID, enrollmentSecret });
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId,
      type: 'X.509',
    };
    await this.hlfService.wallet.put(enrollmentID, x509Identity);
  }

  async getAdminUser() {
    const adminId = this.config.get('ADMIN_ID');
    const adminIdentity = await this.getIdentity(adminId);
    if (!adminIdentity) {
      throw new HttpException('no admin', HttpStatus.BAD_REQUEST);
    }
    const provider = this.hlfService.wallet.getProviderRegistry().getProvider(adminIdentity.type);
    return provider.getUserContext(adminIdentity, adminId);
  }

  async enrollAdmin(msp?: string) {
    const mspId = msp || this.config.get('ORG1_MSP');
    const enrollmentID = this.config.get('ADMIN_ID');
    if (await this.getIdentity(enrollmentID)) {
      return;
    }
    const enrollmentSecret = this.config.get('ADMIN_SECRET');
    await this.putIdentity(enrollmentID, enrollmentSecret, mspId);
  }

  async registerAndEnrollUser(msp?: string, userAffiliation?: string, userId?: string) {
    const mspId = msp || this.config.get('ORG1_MSP');
    const enrollmentID = userId || this.config.get('USER_ID');
    const affiliation = userAffiliation || this.config.get('USER_AFFILIATION');
    if (await this.getIdentity(enrollmentID)) {
      return;
    }
    const adminUser = await this.getAdminUser();
    const secret = await this.hlfService.caClient.register({
      affiliation,
      enrollmentID,
      role: 'client',
    }, adminUser);
    await this.putIdentity(enrollmentID, secret, mspId);
  }

  async rejectUser(userId: string) {
    const adminUser = await this.getAdminUser();
    await this.hlfService.caClient.revoke({enrollmentID: userId}, adminUser);
    const userIdentity = await this.getIdentity(userId);
    if (userIdentity) {
      await this.hlfService.wallet.remove(userId);
    }
  }
}
