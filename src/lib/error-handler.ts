import { toast } from 'sonner';

export function handleError(error: unknown, defaultMessage = 'Something went wrong') {
  if (error instanceof Error) {
    toast.error(error.message || defaultMessage);
    console.error('Error:', error);
    return error.message;
  }
  
  if (typeof error === 'string') {
    toast.error(error);
    return error;
  }

  toast.error(defaultMessage);
  console.error('Unknown error:', error);
  return defaultMessage;
}

export function handleSuccess(message: string) {
  toast.success(message);
}

