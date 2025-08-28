const fs = require('fs');
const path = require('path');

// List of DTOs that need to be updated
const dtosToUpdate = [
  'src/socio-economic/dto/create-education-materials.dto.ts',
  'src/socio-economic/dto/create-health-center.dto.ts',
  'src/socio-economic/dto/create-house-repair.dto.ts',
  'src/socio-economic/dto/create-housing-toilets.dto.ts',
  'src/socio-economic/dto/create-livestock.dto.ts',
  'src/socio-economic/dto/create-empowerment.dto.ts',
  'src/socio-economic/dto/create-it-training.dto.ts',
  'src/socio-economic/dto/create-office.dto.ts',
  'src/socio-economic/dto/create-village-housing.dto.ts',
  'src/socio-economic/dto/create-sports.dto.ts',
  'src/socio-economic/dto/create-water-pumps.dto.ts',
  'src/socio-economic/dto/create-parking.dto.ts',
  'src/socio-economic/dto/create-other-project.dto.ts',
  'src/reports/dto/generate-report.dto.ts',
  'src/conservation/dto/update-eu-project.dto.ts',
  'src/conservation/dto/update-eu-funded-project.dto.ts'
];

// Function to update a DTO file
function updateDtoFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Replace @IsDateString() with @TransformDateNotFuture()
    if (content.includes('@IsDateString()')) {
      content = content.replace(/@IsDateString\(\)/g, '@TransformDateNotFuture()');
      updated = true;
    }

    // Replace @IsDate() with @TransformDate()
    if (content.includes('@IsDate()')) {
      content = content.replace(/@IsDate\(\)/g, '@TransformDate()');
      updated = true;
    }

    // Add import for TransformDateNotFuture if @IsDateString was used
    if (content.includes('@TransformDateNotFuture()') && !content.includes('import { TransformDateNotFuture }')) {
      const importLine = "import { TransformDateNotFuture } from '../../common/transformers/date.transformer';";
      const lastImportIndex = content.lastIndexOf('import');
      const nextLineIndex = content.indexOf('\n', lastImportIndex) + 1;
      content = content.slice(0, nextLineIndex) + importLine + '\n' + content.slice(nextLineIndex);
      updated = true;
    }

    // Add import for TransformDate if @IsDate was used
    if (content.includes('@TransformDate()') && !content.includes('import { TransformDate }')) {
      const importLine = "import { TransformDate } from '../../common/transformers/date.transformer';";
      const lastImportIndex = content.lastIndexOf('import');
      const nextLineIndex = content.indexOf('\n', lastImportIndex) + 1;
      content = content.slice(0, nextLineIndex) + importLine + '\n' + content.slice(nextLineIndex);
      updated = true;
    }

    // Remove IsDateString and IsDate from class-validator imports
    if (content.includes('IsDateString') || content.includes('IsDate')) {
      content = content.replace(/,\s*IsDateString/g, '');
      content = content.replace(/,\s*IsDate/g, '');
      content = content.replace(/IsDateString,\s*/g, '');
      content = content.replace(/IsDate,\s*/g, '');
      updated = true;
    }

    if (updated) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Updated: ${filePath}`);
    } else {
      console.log(`⏭️  No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

// Update all DTOs
console.log('🔄 Updating DTOs with date fields...\n');

dtosToUpdate.forEach(dtoPath => {
  if (fs.existsSync(dtoPath)) {
    updateDtoFile(dtoPath);
  } else {
    console.log(`⚠️  File not found: ${dtoPath}`);
  }
});

console.log('\n✨ DTO update process completed!');
