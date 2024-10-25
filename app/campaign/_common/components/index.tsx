'use client';

import { JOB_TITLES } from 'app/(authenticated)/(applicant)/profile/_common/constant';
import Image from 'next/image';

import { Loader } from '@/common/components/Loader';
import UISelectDropDown from '@/common/components/UISelectDropDown';
import UITextField from '@/common/components/UITextField';
import { capitalize } from '@/common/utils/capitalize';
import Footer from '@/components/footer';
import NursanaLogo from '@/components/nursana-logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import Section from '../../../../components/section';
import { useUploadCampaign } from '../hooks/useUpload';
import ResumeUpload from './ResumeUpload';

export default function FormCampaign() {
  const { form, saving, handleSubmit } = useUploadCampaign();

  const {
    control,
    setValue,
    clearErrors,
    formState: { isDirty },
  } = form;
  return (
    <Section>
      <div className='flex min-h-[calc(100vh-72px)] w-full flex-col items-center justify-center gap-8'>
        <div className='grid grid-cols-2 border border-border rounded-xl overflow-hidden'>
          <Form {...form}>
            <form
              className='mb-4 w-full'
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <Card className='max-w-lg border-none bg-white shadow-none'>
                <CardContent className='mt-6'>
                  <div className='mt-6 flex max-w-screen-xl flex-col gap-1'>
                    <NursanaLogo />
                    <h1 className='mb-4 mt-4 text-2xl font-medium'>
                      Let Nursana&apos;s AI find your next opportunity.{' '}
                      <span className='text-purple-500'>Get started now!</span>
                    </h1>
                  </div>
                  <div className='flex flex-col gap-4'>
                    <div className='grid w-full grid-cols-2 gap-4'>
                      <FormField
                        control={control}
                        name='role'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <FormControl>
                              <UISelectDropDown
                                disabled={saving}
                                fullWidth
                                menuOptions={JOB_TITLES.map((role) => ({
                                  name: capitalize(role),
                                  value: role,
                                }))}
                                onValueChange={(
                                  val: (typeof JOB_TITLES)[0],
                                ) => {
                                  clearErrors('role');
                                  setValue('role', val);
                                }}
                                value={field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name='email'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Email</FormLabel>
                            <FormControl>
                              <UITextField
                                disabled={saving}
                                fullWidth
                                placeholder='Enter your email'
                                type='email'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='grid w-full grid-cols-2 gap-4'>
                      <FormField
                        control={control}
                        name='first_name'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>First Name</FormLabel>
                            <FormControl>
                              <UITextField
                                disabled={saving}
                                fullWidth
                                placeholder='Enter your first name'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name='last_name'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <UITextField
                                disabled={saving}
                                fullWidth
                                placeholder='Enter your last name'
                                {...field}
                                value={field.value || ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={control}
                      name='image'
                      render={({ field: { value } }) => (
                        <FormItem>
                          <FormLabel required>Upload Resume</FormLabel>
                          <FormControl>
                            <ResumeUpload
                              saving={saving}
                              onChange={(file: File | null) => {
                                if (file) {
                                  setValue('image', file);
                                  clearErrors('image');
                                } else {
                                  // @ts-ignore
                                  setValue('file', null);
                                  clearErrors('image');
                                }
                              }}
                              value={value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className='flex'>
                      <FormField
                        control={form.control}
                        name='terms_accepted'
                        render={({ field }) => (
                          <FormItem className='flex flex-row items-start gap-3 space-y-0'>
                            <FormControl>
                              <Checkbox
                                checked={field.value === 'true' ? true : false}
                                onCheckedChange={(value) => {
                                  field.onChange(String(value));
                                }}
                              />
                            </FormControl>
                            <div className='space-y-1 leading-none'>
                              <FormLabel>Accept terms and conditions</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      className='w-full'
                      type='submit'
                      disabled={
                        !isDirty ||
                        saving ||
                        form.getValues('terms_accepted') === 'false'
                      }
                    >
                      <div className='flex items-center gap-2'>
                        {saving && <Loader />}
                        <span>Get Interview Link</span>
                      </div>
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className='flex'>
                  <p className='text-sm text-muted-foreground'>
                    Already have an account?{' '}
                    <a
                      href='/auth/sign-in'
                      className='text-card-foreground underline'
                    >
                      Login here
                    </a>
                    .
                  </p>
                </CardFooter>
              </Card>
            </form>
          </Form>
          <div className='relative w-full h-full'>
                <Image src={'/images/nurse-1.jpg'} layout='fill' alt='nurse' className='object-cover'/>
          </div>
        </div>
      </div>
      <Footer />
    </Section>
  );
}
