<script setup lang="ts">
import {computed, inject, reactive, ref} from 'vue';
import LineInput from '../Util/LineInput.vue';
import BiggerButton from '../Util/BiggerButton.vue';
import {addResidentAPI} from '../../api/user/addResident';
import {useTypedStore} from '../../store';
import {ElMessage} from 'element-plus';
import dateFormat from 'dateformat';
import useTranslation from '../../config/i18n/useTranslation';

const emit = defineEmits<{
  (e: 'needRefresh'): void
}>();

const store = useTypedStore();
const closeModal = inject<{ (): void } | undefined>('VirryModal.close', undefined);
const userId = computed(() => store.getters['user/userId']);

const message = useTranslation([
  'residentAddition', 'residentName', 'realName',
  'phoneNumber', 'cancel', 'add', 'idNo', 'birthday', 'fieldMissing',
  'AlterResident',
]);

class ResidentInfo {
  name = '';
  phone = '';
  idNo = '';
  birthday: Date | null = null;
}

const residentInfo = reactive(new ResidentInfo());

const firstInput = ref();

const submitModify = async () => {
  if (residentInfo.birthday == null ||
    residentInfo.name == '' ||
    residentInfo.idNo == '' ||
    residentInfo.phone == '') {
    ElMessage.error({
      message: message.value.fieldMissing,
      center: true,
    });
    firstInput.value.focus();
    return;
  }

  const dataString = dateFormat(residentInfo.birthday, 'mm/dd/yyyy');
  try {
    await addResidentAPI({
      realName: residentInfo.name,
      phoneNumber: residentInfo.phone,
      idNo: residentInfo.idNo,
      birthday: dataString,
      userId: userId.value,
    });
    closeModal?.();
    ElMessage.success({
      message: '入住人添加成功',
      center: true,
    });
    emit('needRefresh');
  } catch (e) {
    console.log(e);
  }
};
</script>

<template>
  <section class="resident-addition">
    <h3>{{ message.residentAddition }}</h3>
    <LineInput
      :label="message.residentName"
      :placeholder="message.realName"
      v-model="residentInfo.name"
      ref="firstInput"
    />

    <LineInput
      :label="message.phoneNumber"
      :placeholder="message.phoneNumber"
      v-model="residentInfo.phone"
    />

    <LineInput
      :label="message.idNo"
      :placeholder="message.idNo"
      v-model="residentInfo.idNo"
    />

    <div class="inline">
      {{ message.birthday }}
      <ElDatePicker v-model="residentInfo.birthday" />
    </div>

    <div class="inline">
      <BiggerButton
        color="red"
        :text="message.cancel"
        @click="closeModal"
      />
      <BiggerButton
        color="green"
        :text="message.add"
        @click="submitModify"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use "src/util/Other";

.resident-addition {
  @include Other.center-flex;
  @include Other.card;
  flex-direction: column;
}

.inline {
  @include Other.even-line;
  width: 100%;
  margin: 5px;
}


label {
  width: 400px;
  margin: 10px;
}

</style>
