import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { BaseResponse } from '@common/response/base.response';
import ApplyDecorators from './apply-decorator.types';

export function ApiBaseResponse<TModel>(
  model: Type<TModel>,
  options: {
    status?: number;
    description?: string;
    isArray?: boolean;
  } = {},
): ApplyDecorators {
  const status = options.status ?? 200;
  const description = options.description ?? 'Successful response';
  const isArray = options.isArray ?? false;

  const dataSchema = isArray
    ? {
        type: 'array',
        items: { $ref: getSchemaPath(model) },
      }
    : { $ref: getSchemaPath(model) };

  return applyDecorators(
    ApiExtraModels(BaseResponse, model),
    ApiResponse({
      status,
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseResponse) },
          {
            properties: {
              data: dataSchema,
            },
          },
        ],
      },
    }),
  );
}
