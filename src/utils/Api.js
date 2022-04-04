import { User } from '@/utils/apiModules/User';
import { Common } from '@/utils/apiModules/Common';
import { Menu } from '@/utils/apiModules/Menu';
import { Role } from '@/utils/apiModules/Role';
import { Organization } from '@/utils/apiModules/Organization';
import { Course } from '@/utils/apiModules/Course';
import { Exam } from '@/utils/apiModules/Exam';
import { Exercise } from '@/utils/apiModules/Exercise';
import { Class } from '@/utils/apiModules/Class';
import { Enterprise } from '@/utils/apiModules/Enterprise';
import { Statistics } from '@/utils/apiModules/Statistics';
import { WorkingProcess } from '@/utils/apiModules/WorkingProcess';
import { Policy } from '@/utils/apiModules/Policy';

export const Api = {
  class: Class,
  user: User,
  common: Common,
  menu: Menu,
  role: Role,
  organization: Organization,
  course: Course,
  exam: Exam,
  exercise: Exercise,
  enterprise: Enterprise,
  statistics: Statistics,
  workingProcess: WorkingProcess,
  policy: Policy
}
