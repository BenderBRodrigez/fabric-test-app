import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Wallet, Wallets } from 'fabric-network';
import * as FabricCAServices from 'fabric-ca-client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class HlfService {
  public ccp: JSON;
  public wallet: Wallet;
  public caClient: FabricCAServices;

  constructor(
    private readonly config: ConfigService,
  ) {
  }

  async init() {
    this.ccp = this.buildCCPOrg1();
    this.caClient = this.buildCAClient(this.ccp, this.config.get('CA_HOST_NAME'));

    const walletPath = path.resolve(__dirname, '../../../../wallet');
    this.wallet = await this.buildWallet(walletPath);
  }

  buildCCPOrg1() {
    const ccpPath = path.resolve(__dirname, '../../../..', this.config.get('CCP_PATH_ORG_1'));
    const fileExists = fs.existsSync(ccpPath);
    if (!fileExists) {
      throw new Error(`no such file or directory: ${ccpPath}`);
    }
    const contents = fs.readFileSync(ccpPath, 'utf8');
    return JSON.parse(contents);
  }

  buildWallet(walletPath?: string) {
    return walletPath ? Wallets.newFileSystemWallet(walletPath) : Wallets.newInMemoryWallet();
  }

  buildCAClient(ccp: Record<string, any>, caHostName: string) {
    const caInfo = ccp.certificateAuthorities[caHostName];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    return new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
  }
}
