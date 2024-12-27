import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../../components/button/button.component';
import { Habilidad } from '../../../models/usuario.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { UtilsService } from '../../../services/utils.service';
import { UsuarioService } from '../../../services/usuario-service.service';
import { NotificationService } from '../../../services/notification.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-skills-page',
  imports: [ButtonComponent, MatIconModule, ReactiveFormsModule],
  templateUrl: './edit-skills-page.component.html',
  styleUrl: './edit-skills-page.component.css'
})
export class EditSkillsPage {
  options = signal([
    ['APTITUDES', 'APTITUD'], 
    ['IDIOMAS', 'IDIOMA'], 
    ['LENGUAGES DE PROGRAMACIÓN', 'LENGUAJE PROGRAMACION'], 
    ['HERRAMIENTAS', 'HERRAMIENTA'],
    ['OTROS', 'OTRO'],
  ])
  option = 'APTITUDES';
  skills:Habilidad[] = [];
  filteredSkills: Habilidad[]=[];
  private skillsToSend: Habilidad[] = [];
  skillForm:FormGroup
  constructor(
    private activatedRoute:ActivatedRoute,
    private router: Router,
    private formBuilder:FormBuilder,
    protected utils:UtilsService,
    private usuarioService:UsuarioService,
    private noti:NotificationService,
    private location: Location
  ){
    console.log(activatedRoute);
    console.log(activatedRoute.snapshot.paramMap);
    console.log(router.getCurrentNavigation());
    console.log(router.getCurrentNavigation()?.extras.state);
    this.skills = (router.getCurrentNavigation()?.extras.state?.['skills'] || []) as Habilidad[];
    this.skillForm = formBuilder.group({
      'nombre': ['', ]
    });

    this.skillsToSend = this.skills;

    const escapeListener = (e: KeyboardEvent) => {
      console.log(e);
      if (e.key === 'Escape') {
        this.location.back();
        window.removeEventListener('keyup', escapeListener);
      }
    };
  
    window.addEventListener('keyup', escapeListener);
  }


  selectSkillType(option:string){
    this.option = option;
    this.filteredSkills = this.skills.filter(el=> el.tipo == option);
  }


  onInputAdd(e:Event){
    e.preventDefault();
    this.toggleSkill(this.skillForm.get('nombre')?.value);
    this.skillForm.reset();
  }
  onSubmit(){
    let id:number = this.activatedRoute.parent?.snapshot.paramMap.get('id') as unknown as number;
    this.usuarioService.postHabilidades(id, {habilidades: this.skills}).subscribe({
      next:res=>{
        this.noti.notificate('Habilidades cargadas con éxito', '', false, 5000);
        this.location.back();
      },
      error:err=>{
        this.noti.notificateErrorsResponse(err.error);
      }
    });
  }

  toggleSkill(skill:string){
    let found = this.filteredSkills.find(el=>el.nombre.toLowerCase() == skill.toLowerCase());
    if(!found){
      this.addSkill(skill);
    }else{
      this.removeSkill(skill);
    }
    this.selectSkillType(this.option);
  }
  private addSkill(skill:string){
    this.skills.push({nombre: skill, tipo: this.option});
  }
  private removeSkill(skill:string){
    this.skills = this.skills.filter(el=>el.nombre.toLowerCase() != skill.toLowerCase());
  }
}
