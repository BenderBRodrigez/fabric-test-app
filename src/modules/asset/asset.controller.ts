import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChainMethod } from './chain-methods.enum';
import { HlfService } from '../shared/services/hlf.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';


@ApiTags('asset')
@Controller('assets')
export class AssetController {
  constructor(
    private readonly hlfService: HlfService,
  ) {
  }

  @Post('init')
  @ApiOperation({ summary: 'Create Initial Asset' })
  async initAssets() {
    await this.hlfService.contract.submitTransaction(ChainMethod.InitLedger);
    return;
  }

  @Get()
  @ApiOperation({ summary: 'Get All Assets' })
  async getAssets() {
    const result = await this.hlfService.contract.evaluateTransaction(ChainMethod.GetAllAssets);
    return this.hlfService.Buffer2JSON(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Asset by Id' })
  async getAsset(@Param('id') id: string) {
    const result = await this.hlfService.contract.evaluateTransaction(ChainMethod.GetAsset, id);
    return this.hlfService.Buffer2JSON(result);
  }

  @Post()
  @ApiOperation({summary: 'Create New Asset'})
  async createAsset(@Body() input: CreateAssetDto) {
    await this.hlfService.contract.submitTransaction(ChainMethod.CreateAsset, JSON.stringify(input));
    const result = await this.hlfService.contract.evaluateTransaction(ChainMethod.GetAsset, input.id);
    return this.hlfService.Buffer2JSON(result);
  }

  @Put(':id')
  @ApiOperation({summary: 'Update Asset by Id'})
  async updateAsset(@Param('id') id: string, @Body() input: UpdateAssetDto) {
    await this.hlfService.contract.submitTransaction(ChainMethod.UpdateAsset, JSON.stringify({...input, id}));
    const result = await this.hlfService.contract.evaluateTransaction(ChainMethod.GetAsset, id);
    return this.hlfService.Buffer2JSON(result);
  }

  @Delete(':id')
  @ApiOperation({summary: 'Delete Asset by Id'})
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAsset(@Param('id') id: string) {
    await this.hlfService.contract.submitTransaction(ChainMethod.DeleteAsset, id);
    return;
  }

}
