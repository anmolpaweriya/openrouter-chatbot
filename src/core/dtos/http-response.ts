import { ApiProperty } from '@nestjs/swagger';

export class MetaDto<F = any> {
  @ApiProperty()
  count?: number;

  @ApiProperty()
  total?: number;

  @ApiProperty({
    type: Boolean,
    default: true,
    example: true,
  })
  success?: boolean = true;

  @ApiProperty()
  traceId?: string;

  @ApiProperty()
  message?: string;

  @ApiProperty()
  statusCode?: number;

  @ApiProperty()
  errorMessage?: string;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
  })
  failures?: F | null;

  constructor(failures?: F) {
    if (failures) {
      this.failures = failures;
      this.success = false;
    }
  }
}

export class HttpResponseDto<D = any, E = any> {
  @ApiProperty()
  data?: D | null;

  @ApiProperty({
    type: MetaDto,
  })
  meta: MetaDto<E>;

  constructor(data?: D, failures?: E) {
    this.data = data ?? null;
    this.meta = new MetaDto<E>(failures);
  }
}
