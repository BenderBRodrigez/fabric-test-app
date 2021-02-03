import { Body, Controller, Delete, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HlfAdminService } from './hlf-admin.service';
import { CreateHlfUserDto } from './dto/create-hlf-user.dto';
import { DeleteHlfUserDto } from './dto/delete-hlf-user.dto';


@ApiTags('hlf admin')
@Controller('hlf')
export class HlfAdminController {
  constructor(
    private readonly config: ConfigService,
    private readonly hlfAdminService: HlfAdminService,
  ) {
  }

  @Post('user')
  @ApiOperation({ summary: 'Create HLF User' })
  @HttpCode(HttpStatus.CREATED)
  createUser(@Body() input: CreateHlfUserDto) {
    const msp = this.config.get('ORG1_MSP');
    return this.hlfAdminService.registerAndEnrollUser(msp, input.affiliation, input.user);
  }

  @Delete('user')
  @ApiOperation({ summary: 'Reject HLF User' })
  @HttpCode(HttpStatus.NO_CONTENT)
  rejectUser(@Body() input: DeleteHlfUserDto) {
    return this.hlfAdminService.rejectUser(input.user);
  }
}
